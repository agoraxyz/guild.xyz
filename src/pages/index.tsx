import {
  Center,
  Circle,
  Flex,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { guild } from "@guildxyz/sdk"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import useUpvoty from "components/common/Layout/components/InfoMenu/hooks/useUpvoty"
import Link from "components/common/Link"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/index/CategorySection"
import ExplorerCardMotionWrapper from "components/index/ExplorerCardMotionWrapper"
import GuildCard from "components/index/GuildCard"
import useMemberships from "components/index/hooks/useMemberships"
import OrderSelect, { OrderOptions } from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import { useQueryState } from "hooks/useQueryState"
import useScrollEffect from "hooks/useScrollEffect"
import { GetStaticProps } from "next"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { GuildBase } from "types"

const AnimatedLogo = dynamic(() => import("components/index/AnimatedLogo"), {
  ssr: false,
  loading: () => <Circle size={{ base: 12, lg: 14 }} mr={-3} />,
})
const BATCH_SIZE = 24

type Props = {
  guilds: GuildBase[]
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const [search, setSearch] = useQueryState<string>("search", undefined)
  const [order, setOrder] = useQueryState<OrderOptions>("order", "members")

  const query = new URLSearchParams({ order, ...(search && { search }) }).toString()

  const [guilds, setGuilds] = useState(guildsInitial)
  const [renderedGuildsCount, setRenderedGuildsCount] = useState(BATCH_SIZE)

  useEffect(() => {
    setRenderedGuildsCount(BATCH_SIZE)
  }, [search])

  const guildsListEl = useRef(null)

  useScrollEffect(() => {
    if (
      !guildsListEl.current ||
      guildsListEl.current.getBoundingClientRect().bottom > window.innerHeight ||
      guilds?.length <= renderedGuildsCount
    )
      return

    setRenderedGuildsCount((prevValue) => prevValue + BATCH_SIZE)
  })

  const renderedGuilds = useMemo(
    () => guilds?.slice(0, renderedGuildsCount) || [],
    [guilds, renderedGuildsCount]
  )

  const { data: guildsData, isValidating: isLoading } = useSWR(`/guild?${query}`, {
    dedupingInterval: 60000, // one minute
  })
  useEffect(() => {
    if (guildsData) setGuilds(guildsData)
  }, [guildsData])

  const [usersGuilds, setUsersGuilds] = useState<GuildBase[]>([])
  const { data: usersGuildsData, isValidating: isUsersLoading } = useSWR(
    account ? `/guild/address/${account}?${query}` : null,
    {
      dedupingInterval: 60000, // one minute
    }
  )
  useEffect(() => {
    if (usersGuildsData) setUsersGuilds(usersGuildsData)
  }, [usersGuildsData])

  const memberships = useMemberships()

  // Setting up the dark mode, because this is a "static" page
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  const { isRedirecting, upvotyAuthError } = useUpvoty()

  if (isRedirecting)
    return (
      <Flex alignItems="center" justifyContent="center" direction="column" h="100vh">
        <Heading mb={4} fontFamily="display">
          Guild - Upvoty authentication
        </Heading>
        {upvotyAuthError ? (
          <Text as="span" fontSize="lg">
            You are not a member of any guilds. Please <Link href="/">join one</Link>{" "}
            and you can vote on the roadmap!
          </Text>
        ) : (
          <HStack>
            <Spinner size="sm" />
            <Text as="span" fontSize="lg">
              Redirecting, please wait...
            </Text>
          </HStack>
        )}
      </Flex>
    )

  return (
    <>
      <LinkPreviewHead path="" />
      <Layout
        title="Guild"
        description="Automated membership management for the platforms your community already uses."
        image={<AnimatedLogo />}
      >
        <SimpleGrid
          templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
          gap={{ base: 2, md: "6" }}
          mb={16}
        >
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <SearchBar placeholder="Search guilds" {...{ search, setSearch }} />
          </GridItem>
          <OrderSelect {...{ isLoading, order, setOrder }} />
        </SimpleGrid>

        <Stack ref={guildsListEl} spacing={12}>
          <CategorySection
            title={
              // usersGuilds will be empty in case of unmatched search query, memberships will be empty in case he's owner but not member of guilds
              usersGuilds?.length || memberships?.length
                ? "Your guilds"
                : "You're not part of any guilds yet"
            }
            titleRightElement={isUsersLoading && <Spinner size="sm" />}
            fallbackText={`No results for ${search}`}
          >
            {usersGuilds?.length || memberships?.length ? (
              (usersGuilds.length || !search) &&
              usersGuilds
                .map((g) => (
                  <ExplorerCardMotionWrapper key={g.urlName}>
                    <GuildCard guildData={g} />
                  </ExplorerCardMotionWrapper>
                ))
                .concat(
                  <ExplorerCardMotionWrapper key="create-guild">
                    <AddCard text="Create guild" link="/create-guild" />
                  </ExplorerCardMotionWrapper>
                )
            ) : (
              <ExplorerCardMotionWrapper key="create-guild">
                <AddCard text="Create guild" link="/create-guild" />
              </ExplorerCardMotionWrapper>
            )}
          </CategorySection>

          <CategorySection
            title="All guilds"
            titleRightElement={
              isLoading ? (
                <Spinner size="sm" />
              ) : (
                <Tag size="sm">{guilds.length}</Tag>
              )
            }
            fallbackText={
              search?.length
                ? `No results for ${search}`
                : "Can't fetch guilds from the backend right now. Check back later!"
            }
          >
            {renderedGuilds.length &&
              renderedGuilds.map((g) => (
                <ExplorerCardMotionWrapper key={g.urlName}>
                  <GuildCard guildData={g} />
                </ExplorerCardMotionWrapper>
              ))}
          </CategorySection>

          <Center>{guilds?.length > renderedGuildsCount && <Spinner />}</Center>
        </Stack>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await guild.getAll().catch((_) => [])

  return {
    props: { guilds },
    revalidate: 10,
  }
}

export default Page
