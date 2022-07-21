import { HStack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props<LabelType extends string> = {
  type: LabelType
  typeBackgroundColors: Partial<Record<LabelType, string>>
  typeColors?: Partial<Record<LabelType, string>>
  typeLabel?: Partial<Record<LabelType, string>>
  fallbackColor?: string
} & Rest

const ColorCardLabel = <LabelType extends string>({
  type,
  typeBackgroundColors,
  typeColors,
  typeLabel,
  children,
  fallbackColor = "blackAlpha.600",
  ...rest
}: PropsWithChildren<Props<LabelType>>): JSX.Element => (
  <HStack
    spacing={0}
    position="absolute"
    h={7}
    overflow="hidden"
    alignItems="stretch"
    {...rest}
  >
    {children}
    <Text
      as="span"
      px={4}
      py={1}
      backgroundColor={typeBackgroundColors[type]}
      color={typeColors?.[type] ?? fallbackColor}
      fontSize="sm"
      fontWeight="extrabold"
      borderTopLeftRadius="xl"
    >
      {typeLabel?.[type] ?? type}
    </Text>
  </HStack>
)

export default ColorCardLabel
