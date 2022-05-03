import {
  Box,
  Flex,
  Heading,
  HStack,
  Img,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react"
import { guild } from "@guildxyz/sdk"
import GuildCard from "components/index/GuildCard"
import { GetStaticProps } from "next"
import Head from "next/head"
import { GuildBase } from "types"

type Props = {
  guilds: Array<GuildBase>
}

const LinkPreview = ({ guilds }: Props): JSX.Element => (
  <>
    <Head>
      <meta name="robots" content="noindex" />
    </Head>
    <Box position="relative" bgColor="gray.800" h="100vh" overflow="hidden">
      <SimpleGrid
        position="absolute"
        top={0}
        right={"-5vw"}
        pt={5}
        width="50vw"
        gridTemplateColumns="repeat(2, 1fr)"
        gap={6}
        opacity={0.6}
        transform="scale(1.25)"
        transformOrigin="top"
      >
        {guilds?.slice(0, 12).map((g) => (
          <GuildCard key={g.urlName} guildData={g} />
        ))}
      </SimpleGrid>

      <Box
        position="absolute"
        inset={0}
        bgGradient="linear-gradient(to right, var(--chakra-colors-gray-800) 0%, var(--chakra-colors-gray-800) 45%, transparent 65%, transparent)"
      />

      <Flex
        direction="column"
        position="relative"
        pt={28}
        pl={28}
        maxW="60vw"
        height="calc(100vh - 8rem)"
        alignItems="start"
      >
        <HStack width="full" mb={12} spacing={8}>
          <Img boxSize={"80px"} src="/guildLogos/logo.svg" mt="2" />
          <Heading textColor="white" fontFamily="display" fontSize="8xl" isTruncated>
            Guild
          </Heading>
        </HStack>
        <HStack spacing={6}>
          <Tag
            height={16}
            fontSize="4xl"
            fontWeight="bold"
            px={8}
            bgColor="gray.600"
            textColor="white"
            rounded="xl"
          >
            {`${guilds?.length || 0} guilds`}
          </Tag>
        </HStack>
        <Text
          fontFamily="display"
          fontSize="5xl"
          fontWeight="bold"
          lineHeight={1.2}
          mt="auto"
        >
          Manage roles
          <br />
          in your community
          <br />
          based on tokens &amp; NFTs
        </Text>
      </Flex>
    </Box>
  </>
)

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await guild.getAll().catch((_) => [])
  const WEEK_IN_SECONDS = 604800

  return {
    props: { guilds },
    revalidate: WEEK_IN_SECONDS,
  }
}

export default LinkPreview
