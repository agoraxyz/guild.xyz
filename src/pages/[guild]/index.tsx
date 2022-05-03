import {
  Divider,
  HStack,
  Stack,
  Tag,
  useBreakpointValue,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import { GetGuildsResponse, guild } from "@guildxyz/sdk"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import LeaveButton from "components/[guild]/LeaveButton"
import Members from "components/[guild]/Members"
import RolesByPlatform from "components/[guild]/RolesByPlatform"
import RoleListItem from "components/[guild]/RolesByPlatform/components/RoleListItem"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import TwitterShare from "components/[guild]/TwitterShare"
import useGuildMembers from "hooks/useGuildMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import React, { useEffect, useMemo, useState } from "react"
import { SWRConfig, unstable_serialize, useSWRConfig } from "swr"
import { Guild } from "types"

const GuildPage = (): JSX.Element => {
  const { name, description, imageUrl, platforms, showMembers, roles, admins } =
    useGuild()
  const [DynamicEditGuildButton, setDynamicEditGuildButton] = useState(null)
  const [DynamicAddRoleButton, setDynamicAddRoleButton] = useState(null)

  const singleRole = useMemo(() => roles?.length === 1, [roles])

  const { isAdmin } = useGuildPermission()
  const members = useGuildMembers()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const { colorMode } = useColorMode()
  const guildLogoSize = useBreakpointValue({ base: 48, lg: 56 })
  const guildLogoIconSize = useBreakpointValue({ base: 20, lg: 28 })

  useEffect(() => {
    if (isAdmin) {
      const EditGuildButton = dynamic(
        () => import("components/[guild]/EditGuildButton")
      )
      const AddRoleButton = dynamic(() => import("components/[guild]/AddRoleButton"))
      setDynamicEditGuildButton(EditGuildButton)
      setDynamicAddRoleButton(AddRoleButton)
    }
  }, [isAdmin])

  return (
    <Layout
      title={name}
      textColor={textColor}
      description={description}
      showLayoutDescription
      image={
        <GuildLogo
          imageUrl={imageUrl}
          size={guildLogoSize}
          iconSize={guildLogoIconSize}
          mt={{ base: 1, lg: 2 }}
          bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
        />
      }
      action={
        <HStack>
          {DynamicEditGuildButton ? <DynamicEditGuildButton /> : <LeaveButton />}
        </HStack>
      }
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
    >
      <Stack position="relative" spacing="12">
        <VStack spacing={{ base: 5, sm: 6 }}>
          {(platforms ?? [{ id: -1, type: "", platformName: "" }])?.map(
            (platform) => (
              <RolesByPlatform
                key={platform.id}
                platformId={platform.id}
                platformType={platform.type}
                platformName={platform.platformName}
                roleIds={roles?.map((role) => role.id)}
              >
                <VStack
                  px={{ base: 5, sm: 6 }}
                  py={3}
                  divider={
                    <Divider
                      borderColor={
                        colorMode === "light" ? "blackAlpha.200" : "whiteAlpha.300"
                      }
                    />
                  }
                >
                  {roles
                    ?.sort((role1, role2) => role2.memberCount - role1.memberCount)
                    ?.map((role) => (
                      <RoleListItem
                        key={role.id}
                        roleData={role}
                        isInitiallyExpanded={singleRole}
                      />
                    ))}
                  {platform.type !== "TELEGRAM" && DynamicAddRoleButton && (
                    <DynamicAddRoleButton />
                  )}
                </VStack>
              </RolesByPlatform>
            )
          )}
        </VStack>

        {showMembers && (
          <>
            <Section
              title="Members"
              titleRightElement={
                <Tag size="sm">
                  {members?.filter((address) => !!address)?.length ?? 0}
                </Tag>
              }
            >
              <Members admins={admins} members={members} />
            </Section>
            {isAdmin && <TwitterShare />}
          </>
        )}
      </Stack>
    </Layout>
  )
}

type Props = {
  fallback: { string: Guild }
}

const GuildPageWrapper = ({ fallback }: Props): JSX.Element => {
  /**
   * Manually triggering mutate on mount because useSWRImmutable doesn't do because
   * of the fallback
   */
  const { mutate } = useSWRConfig()
  useEffect(() => {
    mutate(Object.keys(fallback)[0])
  }, [])

  const urlName = Object.values(fallback)[0].urlName

  return (
    <>
      <LinkPreviewHead path={urlName} />
      <SWRConfig value={{ fallback }}>
        <ThemeProvider>
          <GuildPage />
        </ThemeProvider>
      </SWRConfig>
    </>
  )
}

const getStaticProps: GetStaticProps = async ({ params }) => {
  const urlName = params.guild?.toString()
  const endpoint = `/guild/${urlName}`

  const data = await guild.get(urlName).catch((_) => undefined)

  if (!data?.id)
    return {
      notFound: true,
      revalidate: 10,
    }

  return {
    props: {
      fallback: {
        [unstable_serialize([endpoint, undefined])]: data,
      },
    },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: GetGuildsResponse) =>
    Array.isArray(_) ? _.map(({ urlName }) => ({ params: { guild: urlName } })) : []

  const paths = await guild.getAll().then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default WithRumComponentContext("Guild page", GuildPageWrapper)
