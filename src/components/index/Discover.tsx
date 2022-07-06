import { Box, Flex, Heading, Img, Stack, Text, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { LazyMotion, m } from "framer-motion"
import { CaretDown } from "phosphor-react"
import { useState } from "react"
import LandingButton from "./LandingButton"
import LandingWideSection from "./LandingWideSection"

const loadDomAnimationFeatures = () =>
  import("../../framerMotion/domAnimation").then((res) => res.default)
const MotionBox = m(Box)

const openGraphData = [
  {
    url: "https://www.cryptonary.com/how-guild-helps-you-organize-your-dao",
    image:
      "https://www.cryptonary.com/wp-content/uploads/2022/03/Cryptonary_GuildXYZ-2.2.png",
    title: "How Guild helps you organize your DAO",
    description:
      "Guild, a platform that allows users to create private gated communities, hopes to make managing and joining a DAO easier.",
  },
  {
    url: "https://guild.mirror.xyz/HGEontumXcZaf34MJFbdQ_gdNdMD_pNnStuempCdK-g",
    image: "https://images.mirror-media.xyz/nft/OP2oKHdeKSuRkXtbRLzHM.png",
    title: "Our Guild is evolving",
    description:
      "Over 10,000 web3 curious people have created or joined 600 guilds and our developer team has merged 1929 commits on Github, in response to hundreds of feature requests or bug reports.",
  },
  {
    url: "https://www.daomasters.xyz/tools/guild",
    image: "/landing/daomasters-guild-tutorial.jpg",
    title: "DAO Masters - Guild.xyz",
    description: "This is an easy, self-serve way to set up a gated community.",
  },
  {
    url: "https://twitter.com/littlefortunes/status/1500516518970413067",
    image:
      "https://pbs.twimg.com/ext_tw_video_thumb/1500515893629046788/pu/img/HSYb9X3HwJ2MVTH8.jpg:large",
    title: "Caroline | Tales of Elatora ⛩ MINTING NOW! on Twitter",
    description:
      "Daily #NFT Show #167 ⚔️ Today's show is not about an #NFTartist but about a tool you should know if you run a Discord (or are helping to mod one). It's called: 👉 @guildxyz To be clear: I'm not affiliated in any way with this tool, I just like it! Powered by @redlion_news 🦁",
  },
  {
    url: "https://members.delphidigital.io/media/web3-is-a-shared-experience-reka-and-raz-co-founders-of-agora",
    image:
      "https://storage.googleapis.com/members-portal-bucket/uploads/2022/03/Agora-Youtube.png",
    title: "Web3 is a Shared Experience: Reka and Raz, Co-Founders of Agora",
    description:
      "Closing out our Web3 series, we sit down with Reka and Raz, Co-Founders of Agora, a studio DAO building essentials for communities. We dive into community role management with Guild, connecting Web2 and Web3 communities, and much more! ",
  },
  {
    url: "https://twitter.com/guildxyz/status/1464208495809544195",
    image: "https://pbs.twimg.com/media/FFHp3VgX0AsPG_N.jpg:large",
    title: "Guild on Twitter",
    description:
      "Cross-chain token gating is here 🧙‍♂️ What does it mean for @SwaprEth (@DXdao_ ) @nowdaoit @KlimaDAO and all the other communities spreading across blockchains? True multi-chain support for creating groups, read further..",
  },
]

const Discover = (): JSX.Element => {
  const { colorMode } = useColorMode()

  const [sectionHeight, setSectionHeight] = useState<"80vh" | "auto">("80vh")

  return (
    <LandingWideSection
      title="Discover tutorials & updates"
      position="relative"
      mb={-8}
    >
      <LazyMotion features={loadDomAnimationFeatures}>
        <MotionBox
          position="relative"
          initial={{
            height: "80vh",
          }}
          animate={{ height: sectionHeight }}
          overflow="hidden"
        >
          <Box
            gap={{ base: 6, lg: 8 }}
            mt={{ base: -2, md: -4 }}
            sx={{
              columnCount: [1, 1, 2],
            }}
          >
            {openGraphData?.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                isExternal
                w="full"
                _hover={{ textDecoration: "none" }}
              >
                <Card
                  role="group"
                  my={{ base: 2, md: 3, lg: 4 }}
                  w="full"
                  _hover={{
                    bg: colorMode === "light" ? "gray.50" : "gray.600",
                  }}
                >
                  {link.image && (
                    <Img
                      w="full"
                      src={link.image}
                      alt={link.title}
                      _groupHover={{ opacity: 0.8 }}
                    />
                  )}
                  <Stack px={{ base: 5, sm: 6 }} py={7}>
                    <Heading as="h4" fontSize="xl" fontFamily="display">
                      {link.title}
                    </Heading>
                    {link.description && (
                      <Text colorScheme="gray">{link.description}</Text>
                    )}
                  </Stack>
                </Card>
              </Link>
            ))}
          </Box>

          <MotionBox
            position="absolute"
            inset={-1}
            bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800), rgba(39, 39, 42, 0))"
            zIndex="banner"
            pointerEvents="none"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: sectionHeight === "auto" ? 0 : 1,
            }}
          />
        </MotionBox>
      </LazyMotion>

      {sectionHeight !== "auto" && (
        <Flex alignItems="center" justifyContent="center">
          <LandingButton
            mb={8}
            onClick={() => setSectionHeight("auto")}
            rightIcon={<CaretDown />}
          >
            Read more about Guild
          </LandingButton>
        </Flex>
      )}
    </LandingWideSection>
  )
}

export default Discover
