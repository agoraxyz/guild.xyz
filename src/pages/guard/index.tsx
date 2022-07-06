import { Box, Flex, Heading, HStack, Img, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import NavMenu from "components/common/Layout/components/NavMenu"
import LandingButton from "components/index/LandingButton"
import useDCAuthWithCallback from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuthWithCallback"
import { LazyMotion, m, useTransform, useViewportScroll } from "framer-motion"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"
import { ArrowSquareIn, ArrowSquareOut, CaretRight } from "phosphor-react"
import { useMemo } from "react"

const META_TITLE = "Guild Guard - Protect your community"
const META_DESCRIPTION =
  "Guild Guard provides full protection against Discord scams. No more bots spam."

const loadDomAnimationFeatures = () =>
  import("../../framerMotion/domAnimation").then((res) => res.default)
const MotionBox = m(Box)

const Page = (): JSX.Element => {
  const { scrollY } = useViewportScroll()
  const y = useTransform(scrollY, [0, 1], [0, 0.25], {
    clamp: false,
  })

  const router = useRouter()
  const { callbackWithDCAuth, isAuthenticating, authorization } =
    useDCAuthWithCallback("guilds", () => router.push("/guard/setup"))

  const DynamicCtaIcon = useMemo(
    () => dynamic(async () => (!authorization ? ArrowSquareIn : CaretRight)),
    [authorization]
  )

  return (
    <>
      <Head>
        <title>{META_TITLE}</title>
        <link rel="icon" href="guard_favicon.ico" />
        <meta property="og:title" content={META_TITLE} />

        <meta name="description" content={META_DESCRIPTION} />
        <meta property="og:description" content={META_DESCRIPTION} />

        <meta
          property="og:image"
          content="https://guild.xyz/guildGuard/linkpreview.jpg"
        />
        <meta
          name="twitter:image"
          content="https://guild.xyz/guildGuard/linkpreview.jpg"
        />
        <meta property="og:image:width" content="870" />
        <meta property="og:image:height" content="458" />
      </Head>
      <Flex
        position="relative"
        bgColor="gray.800"
        minH="100vh"
        display="flex"
        direction="column"
        alignItems="center"
        justifyContent="start"
      >
        <LazyMotion features={loadDomAnimationFeatures}>
          <MotionBox
            position="absolute"
            top={0}
            left={0}
            width="full"
            height="100vh"
            bgImage="url('/guildGuard/bg.svg')"
            bgSize={{ base: "cover", lg: "calc(100% - 2.25rem) auto" }}
            bgPosition="top 1.75rem center"
            bgRepeat="no-repeat"
            opacity={0.075}
            initial={{
              y: 0,
            }}
            style={{
              y,
            }}
          >
            <Box
              position="absolute"
              inset={0}
              bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800), transparent)"
            />
          </MotionBox>
        </LazyMotion>
        <Box pos={"absolute"} top="2" left="2" zIndex={1}>
          <NavMenu />
        </Box>

        <Flex
          position="relative"
          direction="column"
          alignItems="center"
          px={8}
          pt={{ base: 24, lg: "20vh" }}
          w="full"
          maxW={{
            base: "full",
            md: "container.md",
            lg: "container.lg",
            "2xl": "container.xl",
          }}
        >
          <HStack spacing={4} mb={8}>
            <Img
              mt={{ base: 1, lg: 4 }}
              src="guildGuard/robot.svg"
              alt="Guild Guard"
              boxSize={{ base: 14, md: 20, lg: 32 }}
            />
            <Heading
              as="h2"
              fontFamily="display"
              fontSize={{ base: "4xl", md: "5xl", lg: "7xl" }}
              lineHeight="95%"
            >
              Protect your <br />
              community
            </Heading>
          </HStack>
          <Text
            mb={12}
            maxW={{ base: "450px", lg: "600px" }}
            color="gray.450"
            fontSize={{ base: "lg", lg: "2xl" }}
            fontWeight="bold"
            textAlign="center"
            lineHeight={{ base: "125%", md: "115%" }}
          >
            Guild Guard provides full protection against Discord scams. No more bots
            spam.
          </Text>

          <HStack spacing={{ base: 2, md: 3 }} mb={3}>
            <LandingButton
              onClick={callbackWithDCAuth}
              colorScheme="DISCORD"
              isLoading={isAuthenticating}
              loadingText={
                isAuthenticating ? "Check popup window" : "Loading servers"
              }
              rightIcon={<DynamicCtaIcon />}
            >
              Add to Discord
            </LandingButton>
            <LandingButton
              as="a"
              href="https://docs.guild.xyz/guild/guild-guard"
              target="_blank"
              colorScheme="solid-gray"
              rightIcon={<ArrowSquareOut />}
            >
              Learn more
            </LandingButton>
          </HStack>

          <Text
            color="gray.450"
            fontFamily="display"
            fontWeight="bold"
            textAlign={"center"}
            fontSize={{ base: "xs", lg: "sm" }}
          >
            Web3 CAPTCHA to combat bots with the power of Ethereum.
          </Text>

          <Card
            mt={{ base: 16, lg: "15vh" }}
            mb={{ base: 16, "2xl": 20 }}
            w="full"
            ratio={16 / 10}
            borderRadius={{ base: "lg", md: "2xl" }}
          >
            <video src="/videos/guild-guard.webm" controls />
          </Card>
        </Flex>
      </Flex>
    </>
  )
}

export default Page
