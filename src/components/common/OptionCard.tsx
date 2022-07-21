import { Box, Center, Grid, HStack, Img, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"

type Props = {
  size?: "md" | "lg"
  title: string
  description?: string
  image: string
  bgImage?: string
}

const OptionCard = ({
  size = "md",
  title,
  description,
  image,
  bgImage,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Card>
    <Center
      py={size === "lg" ? { base: 12, md: 20 } : 8}
      position="relative"
      overflow={"hidden"}
    >
      <Img
        position="absolute"
        inset={0}
        w="full"
        h="full"
        src={bgImage ?? image}
        alt={`${title} image`}
        filter={`blur(${bgImage ? 5 : 10}px)`}
        transform="scale(1.25)"
        opacity={0.5}
        objectFit="cover"
      />
      <Img
        src={image}
        alt={`${title} image`}
        borderRadius="full"
        boxSize={{ base: 20, md: 24 }}
        pos="relative"
      />
    </Center>

    <HStack
      px={{ base: 5, md: size === "md" && 4 }}
      py={size === "lg" ? 5 : 4}
      spacing={6}
    >
      <Grid w="full">
        <Text
          as="h4"
          isTruncated
          fontWeight={size === "lg" ? "extrabold" : "bold"}
          title={title}
        >
          {title}
        </Text>
        <Text colorScheme={"gray"} fontSize={size === "md" && "sm"}>
          {description}
        </Text>
      </Grid>
      <Box flex="1 0 auto">{children}</Box>
    </HStack>
  </Card>
)

export default OptionCard
