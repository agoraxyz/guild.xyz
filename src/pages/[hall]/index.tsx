import {
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import JoinButton from "components/[guild]/JoinButton"
import LogicDivider from "components/[guild]/LogicDivider"
import Members from "components/[guild]/Members"
import RequirementCard from "components/[guild]/RequirementCard"
import CustomizationButton from "components/[hall]/CustomizationButton"
import GuildListItem from "components/[hall]/GuildListItem"
import useHall from "components/[hall]/hooks/useHall"
import { ThemeProvider, useThemeContext } from "components/[hall]/ThemeContext"
import useHallMembers from "hooks/useHallMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import React, { useMemo, useState } from "react"
import { SWRConfig } from "swr"
import halls from "temporaryData/halls"
import { Hall } from "temporaryData/types"
import fetchApi from "utils/fetchApi"

const HallPage = (): JSX.Element => {
  const { name, description, imageUrl, guilds } = useHall()

  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const members = useHallMembers(guilds)
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const singleGuild = useMemo(() => guilds?.length === 1, [guilds])

  // Only show the join button if all guilds in the hall are on the same DC server
  const shouldShowJoin = useMemo(() => {
    const platformId = guilds?.[0].guild.guildPlatforms[0].platformId

    guilds?.forEach((guildData) => {
      if (guildData.guild.guildPlatforms[0].platformId !== platformId) return false
    })

    return true
  }, [guilds])

  const [previewGuild, setPreviewGuild] = useState(null)
  const onPreviewClose = () => setPreviewGuild(null)
  const modalFooterBg = useColorModeValue("gray.100", "gray.800")

  return (
    <Layout
      title={name}
      textColor={textColor}
      description={description}
      showLayoutDescription
      imageUrl={imageUrl}
      imageBg={textColor === "primary.800" ? "primary.800" : "transparent"}
      action={
        <HStack spacing={2}>
          {isOwner && (
            <>
              <CustomizationButton />
              <EditButtonGroup />
            </>
          )}
          {shouldShowJoin && <JoinButton />}
        </HStack>
      }
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
    >
      <Stack position="relative" spacing="12">
        {singleGuild ? (
          <Section title="Requirements">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
              <VStack>
                {guilds[0]?.guild?.requirements?.map((requirement, i) => (
                  <React.Fragment key={i}>
                    <RequirementCard requirement={requirement} />
                    {i < guilds[0].guild.requirements.length - 1 && (
                      <LogicDivider logic={guilds[0].guild.logic} />
                    )}
                  </React.Fragment>
                ))}
              </VStack>
            </SimpleGrid>
          </Section>
        ) : (
          <Card px={{ base: 5, sm: 6 }} py={7}>
            <Heading as="h2" mb={8} fontFamily="display" fontSize="2xl">
              Guilds in this hall
            </Heading>

            <VStack divider={<Divider />}>
              {guilds?.map((guildData) => (
                <GuildListItem
                  key={guildData.guild.id}
                  guildData={guildData.guild}
                />
              ))}
            </VStack>
          </Card>
        )}
        <Section
          title={
            <HStack spacing={2} alignItems="center">
              <Text as="span">Members</Text>
              <Tag size="sm">
                {members?.filter((address) => !!address)?.length ?? 0}
              </Tag>
            </HStack>
          }
        >
          <Members members={members} fallbackText="This hall has no members yet" />
        </Section>
      </Stack>
    </Layout>
  )
}

type Props = {
  fallback: Hall
}

const HallPageWrapper = ({ fallback }: Props): JSX.Element => (
  <SWRConfig value={{ fallback }}>
    <ThemeProvider>
      <HallPage />
    </ThemeProvider>
  </SWRConfig>
)

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = halls.find((i) => i.urlName === params.hall)
  const endpoint = `/group/urlName/${params.hall?.toString()}`

  const data =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetchApi(endpoint)

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      fallback: {
        [endpoint]: data,
      },
    },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Hall[]) =>
    _.map(({ urlName: hall }) => ({ params: { hall } }))

  const pathsFromLocalData = mapToPaths(halls)

  const paths =
    DEBUG && process.env.NODE_ENV !== "production"
      ? pathsFromLocalData
      : await fetchApi(`/group`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default HallPageWrapper
