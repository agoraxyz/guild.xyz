import {
  StackDivider,
  useColorMode,
  useRadioGroup,
  UseRadioGroupProps,
  VStack,
} from "@chakra-ui/react"
import React, { PropsWithChildren } from "react"
import RadioOption from "./components/RadioOption"

type Option = PropsWithChildren<{
  value: string | number
  title: string
  description?: string
  icon?: React.FC
  disabled?: string
}>

type Props = {
  options: Option[]
  colorScheme?: string
} & UseRadioGroupProps

const RadioSelect = ({
  options,
  colorScheme = "primary",
  ...useRadioGroupProps
}: Props): JSX.Element => {
  const { getRootProps, getRadioProps } = useRadioGroup(useRadioGroupProps)

  const group = getRootProps()

  const { colorMode } = useColorMode()

  return (
    <VStack
      {...group}
      borderRadius="xl"
      bg={colorMode === "light" ? "white" : "blackAlpha.300"}
      spacing="0"
      border="1px"
      borderColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
      divider={<StackDivider />}
    >
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value })
        return (
          <RadioOption
            key={option.value}
            colorScheme={colorScheme}
            {...radio}
            {...option}
          />
        )
      })}
    </VStack>
  )
}

export default RadioSelect
