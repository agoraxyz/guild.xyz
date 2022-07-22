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
import useAccess from "components/[guild]/RolesByPlatform/hooks/useAccess"
import Tabs from "components/[guild]/Tabs/Tabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import { AnimateSharedLayout } from "framer-motion"
import useGuildMembers from "hooks/useGuildMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import dynamic from "next/dynamic"
import React, { useEffect, useMemo, useState } from "react"
import { SWRConfig, unstable_serialize, useSWRConfig } from "swr"
import { Guild, PlatformType } from "types"
import fetcher from "utils/fetcher"

const GuildPage = (): JSX.Element => {
  const {
    name,
    description,
    imageUrl,
    guildPlatforms,
    showMembers,
    roles,
    admins,
    isLoading,
    onboardingComplete,
  } = useGuild()

  const { data: roleAccesses } = useAccess()

  const sortedRoles = useMemo(() => {
    const byMembers = roles?.sort(
      (role1, role2) => role2.memberCount - role1.memberCount
    )
    if (!roleAccesses) return byMembers

    // prettier-ignore
    const accessedRoles = [], otherRoles = []
    byMembers.forEach((role) =>
      (roleAccesses?.find(({ roleId }) => roleId === role.id)?.access
        ? accessedRoles
        : otherRoles
      ).push(role)
    )
    return accessedRoles.concat(otherRoles)
  }, [roles, roleAccesses])

  const [DynamicGuildMenu, setDynamicGuildMenu] = useState(null)
  const [DynamicAddRoleButton, setDynamicAddRoleButton] = useState(null)
  const [DynamicOnboarding, setDynamicOnboarding] = useState(null)

  const isMember = useIsMember()
  const { isAdmin, isOwner } = useGuildPermission()
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
        !onboardingComplete &&
        guildPlatforms?.[0]?.platformId === PlatformType.DISCORD
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
        action={DynamicGuildMenu && <DynamicGuildMenu />}
      >
        {DynamicOnboarding && <DynamicOnboarding />}

        <Tabs>
          {guildPlatforms?.[0]?.platformId !== PlatformType.TELEGRAM &&
          DynamicAddRoleButton &&
          isMember ? (
            <DynamicAddRoleButton />
          ) : isMember ? (
            <LeaveButton />
          ) : (
            <JoinButton platform={guildPlatforms?.[0]?.platformId} />
          )}
        </Tabs>

        <Stack spacing={12}>
          <Stack spacing={4}>
            <AnimateSharedLayout>
              {sortedRoles?.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </AnimateSharedLayout>
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
        [endpoint]: dataWithoutMembers,
        [unstable_serialize([
          `/guild/details/${params.guild?.toString()}`,
          { method: "POST", body: {} },
        ])]: dataWithoutMembers,
      },
    },
    revalidate: 10,
  }
}

const SSG_PAGES_COUNT = 100
const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Guild[]) =>
    Array.isArray(_)
      ? _.slice(0, SSG_PAGES_COUNT).map(({ urlName: guild }) => ({
          params: { guild },
        }))
      : []

  const paths = await fetcher(`/guild`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default WithRumComponentContext("Guild page", GuildPageWrapper)
