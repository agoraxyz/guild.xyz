import { Spinner, Stack, Tag, useBreakpointValue } from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import LeaveButton from "components/[guild]/LeaveButton"
import Members from "components/[guild]/Members"
import OnboardingProvider from "components/[guild]/Onboarding/components/OnboardingProvider"
import RoleCard from "components/[guild]/RoleCard/RoleCard"
import JoinButton from "components/[guild]/RolesByPlatform/components/JoinButton"
import useIsMember from "components/[guild]/RolesByPlatform/components/JoinButton/hooks/useIsMember"
import Tabs from "components/[guild]/Tabs/Tabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuildMembers from "hooks/useGuildMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import React, { useEffect, useState } from "react"
import { SWRConfig, unstable_serialize, useSWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"

const GuildPage = (): JSX.Element => {
  const {
    name,
    description,
    imageUrl,
    platforms,
    showMembers,
    roles,
    admins,
    isLoading,
  } = useGuild()
  const [DynamicGuildMenu, setDynamicGuildMenu] = useState(null)
  const [DynamicAddRoleButton, setDynamicAddRoleButton] = useState(null)
  const [DynamicOnboarding, setDynamicOnboarding] = useState(null)

  const isMember = useIsMember()
  const { isAdmin } = useGuildPermission()
  const members = useGuildMembers()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const guildLogoSize = useBreakpointValue({ base: 56, lg: 72 })
  const guildLogoIconSize = useBreakpointValue({ base: 28, lg: 36 })

  useEffect(() => {
    if (isAdmin) {
      const GuildMenu = dynamic(() => import("components/[guild]/GuildMenu"))
      const AddRoleButton = dynamic(() => import("components/[guild]/AddRoleButton"))
      setDynamicGuildMenu(GuildMenu)
      setDynamicAddRoleButton(AddRoleButton)

      if (
        platforms?.[0]?.type === "DISCORD" &&
        !roles?.[0]?.platforms?.[0]?.inviteChannel
      ) {
        const Onboarding = dynamic(() => import("components/[guild]/Onboarding"))
        setDynamicOnboarding(Onboarding)
      }
    }
  }, [isAdmin])

  // not importing it dinamically because that way the whole page flashes once when it loads
  const DynamicOnboardingProvider = DynamicOnboarding
    ? OnboardingProvider
    : React.Fragment

  return (
    <DynamicOnboardingProvider>
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
        background={localThemeColor}
        backgroundImage={localBackgroundImage}
      >
        {DynamicOnboarding && <DynamicOnboarding />}

        <Tabs>
          {DynamicGuildMenu ? (
            <DynamicGuildMenu />
          ) : isMember ? (
            <LeaveButton />
          ) : (
            <JoinButton
              platform={platforms?.[0]?.type}
              roleIds={roles?.map((role) => role.id)}
            />
          )}
        </Tabs>

        <Stack spacing={12}>
          <Stack spacing={6}>
            {roles
              ?.sort((role1, role2) => role2.memberCount - role1.memberCount)
              ?.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
          </Stack>

          {showMembers && (
            <>
              <Section
                title="Members"
                titleRightElement={
                  <Tag size="sm">
                    {isLoading ? (
                      <Spinner size="xs" />
                    ) : (
                      members?.filter((address) => !!address)?.length ?? 0
                    )}
                  </Tag>
                }
              >
                <Members isLoading={isLoading} admins={admins} members={members} />
              </Section>
            </>
          )}
        </Stack>

        {/* Old guild page */}
        {/* <Stack position="relative" spacing="12">
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
                    {isLoading ? (
                      <Spinner size="xs" />
                    ) : (
                      members?.filter((address) => !!address)?.length ?? 0
                    )}
                  </Tag>
                }
              >
                <Members isLoading={isLoading} admins={admins} members={members} />
              </Section>
            </>
          )}
        </Stack> */}
      </Layout>
    </DynamicOnboardingProvider>
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
  const endpoint = `/guild/${params.guild?.toString()}`

  const data = await fetcher(endpoint).catch((_) => ({}))

  if (!data?.id)
    return {
      notFound: true,
      revalidate: 10,
    }

  // Removing the members list, and then we refetch them on client side. This way the members won't be included in the SSG source code.
  const dataWithoutMembers = { ...data }
  dataWithoutMembers.roles?.forEach((role) => (role.members = []))

  return {
    props: {
      fallback: {
        [unstable_serialize([endpoint, undefined])]: dataWithoutMembers,
      },
    },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Guild[]) =>
    Array.isArray(_) ? _.map(({ urlName: guild }) => ({ params: { guild } })) : []

  const paths = await fetcher(`/guild`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default WithRumComponentContext("Guild page", GuildPageWrapper)
