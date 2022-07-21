import { Box, Divider, Flex, HStack, Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import { platforms } from "components/create-guild/PlatformsGrid/PlatformsGrid"
import Image from "next/image"
import { PropsWithChildren } from "react"
import { PlatformName, Rest } from "types"

const platformBackgroundColor: Partial<Record<PlatformName, string>> = {
  DISCORD: "var(--chakra-colors-DISCORD-500)",
  TELEGRAM: "var(--chakra-colors-TELEGRAM-500)",
}

const platformTypeLabel = Object.fromEntries(
  Object.entries(platforms).map(([key, { label }]) => [key, label])
)

type Props = {
  type: PlatformName
  imageUrl: string
  name: string
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
} & Rest

const PlatformCard = ({
  type,
  name,
  imageUrl,
  actionRow,
  cornerButton,
  children,
  ...rest
}: PropsWithChildren<Props>) => (
  <ColorCard
    gridColumn={{ md: actionRow && "span 2" }}
    color={platformBackgroundColor[type]}
    pt={{ base: 10, sm: 11 }}
    {...rest}
  >
    {cornerButton && (
      <Box position="absolute" top={2} right={2}>
        {cornerButton}
      </Box>
    )}
    <Flex
      justifyContent={"space-between"}
      flexDirection={{ base: "column", md: "row" }}
    >
      <HStack spacing={3}>
        <Box
          overflow={"hidden"}
          borderRadius="full"
          width={10}
          height={10}
          position="relative"
        >
          {imageUrl.length > 0 && <Image src={imageUrl} alt={name} layout="fill" />}
        </Box>
        <Text fontWeight={"bold"}>{name}</Text>
      </HStack>
      {actionRow && (
        <>
          <Divider my={3} d={{ md: "none" }} />
          {actionRow}
        </>
      )}
    </Flex>
    {children}
    <ColorCardLabel
      fallbackColor="white"
      type={type}
      typeBackgroundColors={platformBackgroundColor}
      typeLabel={platformTypeLabel}
      top="-px"
      left="-px"
      borderBottomRightRadius="xl"
      borderTopLeftRadius="xl"
    />
  </ColorCard>
)

export default PlatformCard
