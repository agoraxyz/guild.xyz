import { Circle, Stack, Text } from "@chakra-ui/react"
import dynamic from "next/dynamic"
import Head from "next/head"

const AnimatedLogo = dynamic(() => import("components/index/AnimatedLogo"), {
  ssr: false,
  loading: () => <Circle size={"80px"} />,
})

const Page = (): JSX.Element => (
  <>
    <Head>
      <title>Guild</title>
      <meta property="og:title" content="Guildhall" />
      <meta name="description" content="A place for Web3 guilds" />
      <meta property="og:description" content="A place for Web3 guilds" />
    </Head>
    <Stack
      bgColor="gray.800"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      p="4"
      spacing={8}
    >
      <AnimatedLogo />
      <Text
        fontFamily="display"
        fontSize="4xl"
        textAlign="center"
        fontWeight="bold"
        color="white"
      >
        Under maintenance
        <br />
        Check back later!
      </Text>
    </Stack>
  </>
)

export default Page
