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
import GuildAvatar from "components/common/GuildAvatar"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { Guild, GuildBase } from "types"

const unique = (value, index, self): boolean => self.indexOf(value) === index

const generateRandomAddress = () =>
  `0x${[...Array(40)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("")}`

type Props = {
  guildData: GuildBase & Guild
}

const LinkPreview = ({ guildData }: Props): JSX.Element => (
  <>
    <Head>
      <meta name="robots" content="noindex" />
    </Head>
    <Box position="relative" bgColor="gray.800" h="100vh">
      <SimpleGrid
        position="absolute"
        top={0}
        right={0}
        px={12}
        py={16}
        width="40vw"
        height="100vh"
        gridTemplateColumns="repeat(4, 1fr)"
        gridTemplateRows="repeat(7, 1fr)"
        gap={10}
        opacity={0.6}
      >
        {guildData.members.map((address) => (
          <Flex key={address} alignItems="center" justifyContent="center">
            <GuildAvatar size={24} address={address} />
          </Flex>
        ))}
      </SimpleGrid>

      <Box
        position="absolute"
        inset={0}
        bgGradient="linear-gradient(to right, var(--chakra-colors-gray-800) 0%, var(--chakra-colors-gray-800) 55%, transparent 85%, transparent)"
      />

      <Flex
        direction="column"
        position="relative"
        pt={28}
        pl={28}
        maxW="55vw"
        height="calc(100vh - 7rem)"
        alignItems="start"
      >
        <HStack w="full" mb={12} spacing={8}>
          <Img boxSize={24} src={guildData.imageUrl} rounded="full" mt="3" />
          <Heading textColor="white" fontFamily="display" fontSize="8xl" isTruncated>
            {guildData.name}
          </Heading>
        </HStack>
        <HStack mb={16} spacing={6}>
          <Tag
            height={16}
            fontSize="4xl"
            fontWeight="bold"
            px={8}
            bgColor="gray.600"
            textColor="white"
            rounded="xl"
          >
            {`${guildData.memberCount} members`}
          </Tag>
          <Tag
            height={16}
            fontSize="4xl"
            fontWeight="bold"
            px={8}
            bgColor="gray.600"
            textColor="white"
            rounded="xl"
          >
            {`${guildData.roles.length} roles`}
          </Tag>
        </HStack>
        <Text
          fontFamily="display"
          fontSize="5xl"
          fontWeight="bold"
          lineHeight={1.2}
          noOfLines={3}
        >
          {guildData.description || (
            <>
              That's a great party in there!
              <br />I dare you to be the plus one.
            </>
          )}
        </Text>

        <HStack mt="auto" spacing={4}>
          <Img boxSize={10} src="/guildLogos/logo.svg" />
          <Heading textColor="white" fontFamily="display" fontSize="4xl">
            guild.xyz
          </Heading>
        </HStack>
      </Flex>
    </Box>
  </>
)

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const urlName = params.guild?.toString()
  const data = await guild.get(urlName)

  if (!data) {
    return {
      props: {
        guildData: null,
      },
    }
  }

  const roles = data.roles?.map((role) => role.name)

  const members =
    data.roles
      .map((role) => role.members)
      ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
      ?.filter(unique)
      ?.filter((member) => typeof member === "string") || []

  // For displaying 24 guildAvatars
  const generateFakeMembers = () => {
    if (members.length >= 24) return members.slice(0, 24)

    const fakeArray = [...members]

    for (let i = members.length; i < 24; i++) {
      fakeArray.push(generateRandomAddress())
    }

    return fakeArray
  }

  const fakeMembers = generateFakeMembers()

  return {
    props: {
      guildData: {
        ...data,
        roles,
        members: fakeMembers,
        memberCount: members.length,
      },
    },
  }
}

export default LinkPreview
