import { Box, Container, Stack } from "@chakra-ui/react"
import { LazyMotion, m, useAnimation } from "framer-motion"
import { PropsWithChildren, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { Rest } from "types"
import LandingSectionTitle from "./LandingSectionTitle"

type Props = {
  title: string
} & Rest

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
const MotionStack = m(Stack)

const LandingWideSection = ({
  title,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const controls = useAnimation()
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    controls.start("visible")
  }, [controls, inView])

  return (
    <Box
      as="section"
      position="relative"
      pt={{ base: 7, md: "unset" }}
      pb={{ base: 16, md: 28 }}
      bgColor="gray.800"
      zIndex="banner"
    >
      <Container
        position="relative"
        maxW={{ base: "container.sm", md: "container.md", lg: "container.lg" }}
        px={{ base: 8, lg: 10 }}
      >
        <LazyMotion features={loadDomAnimationFeatures}>
          <MotionStack
            ref={ref}
            as="section"
            initial="hidden"
            animate={controls}
            variants={variants}
            spacing={{ base: 8, md: 12 }}
            {...rest}
          >
            <LandingSectionTitle textAlign="center">{title}</LandingSectionTitle>
            {children}
          </MotionStack>
        </LazyMotion>
      </Container>
    </Box>
  )
}

export default LandingWideSection
