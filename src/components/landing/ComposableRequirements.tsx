import { Box, Img } from "@chakra-ui/react"
import LandingSection from "./LandingSection"

const ComposableRequirements = (): JSX.Element => (
  <LandingSection
    title="Composable membeship requirements"
    photo={
      <Box position="relative" width="full">
        <Img
          width="full"
          src="/landing/composable-membership-requirements.png"
          alt="Composable membeship requirements"
        />

        <Img
          position="absolute"
          left={-4}
          bottom={-16}
          width={{ base: "calc(100% + 3rem)", lg: "calc(100% + 6rem)" }}
          maxW="none"
          src="/landing/composable-membership-requirements-icons.png"
          alt="Composable membeship requirements - icons"
        />
      </Box>
    }
    content={`On-chain integrations and \nexternal APIs are available. \nPlay with logic gates and \ncross-chain opportunities.`}
  />
)

export default ComposableRequirements
