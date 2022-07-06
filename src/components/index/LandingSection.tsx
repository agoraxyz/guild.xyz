import { Box, Container, GridItem, SimpleGrid, VStack } from "@chakra-ui/react"
import { LazyMotion, m, useAnimation } from "framer-motion"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import LandingSectionTitle from "./LandingSectionTitle"

type Props = {
  title: string
  media: JSX.Element
  content: JSX.Element
  flipped?: boolean
}

const variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

const loadDomAnimationFeatures = () =>
  import("../../framerMotion/domAnimation").then((res) => res.default)
const MotionGridItem = m(GridItem)

const LandingSection = ({ title, media, content, flipped }: Props): JSX.Element => {
  const controls = useAnimation()
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    controls.start("visible")
  }, [controls, inView])

  return (
    <Box as="section" pb={{ base: 16, md: 28 }} bgColor="gray.800" zIndex="banner">
      <Container position="relative" maxW="container.lg" px={{ base: 8, md: 12 }}>
        <SimpleGrid
          ref={ref}
          columns={12}
          rowGap={{ base: 8, md: 0 }}
          columnGap={{ base: 0, md: 10, lg: 16 }}
          w="full"
        >
          <LazyMotion features={loadDomAnimationFeatures}>
            <MotionGridItem
              initial="hidden"
              animate={controls}
              variants={variants}
              colSpan={{ base: 12, md: 6, lg: 5 }}
              order={{ base: 1, md: flipped ? 2 : 1 }}
              w="full"
            >
              <VStack
                spacing={4}
                py={4}
                textAlign={{ base: "center", md: "left" }}
                maxW="330px"
                alignItems={{ md: "start" }}
                mx={{ base: "auto", md: "unset" }}
              >
                <LandingSectionTitle>{title}</LandingSectionTitle>
                {content}
              </VStack>
            </MotionGridItem>

            <MotionGridItem
              initial="hidden"
              animate={controls}
              variants={variants}
              colSpan={{ base: 12, md: 6, lg: 7 }}
              order={{ base: 2, md: flipped ? 1 : 2 }}
              w="full"
              maxW={{ sm: "70%", md: "full" }}
              justifySelf="center"
            >
              {media}
            </MotionGridItem>
          </LazyMotion>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default LandingSection
