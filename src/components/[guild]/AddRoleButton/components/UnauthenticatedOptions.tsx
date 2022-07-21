import {
  useColorMode,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import { PropsWithChildren } from "react"
import { useController } from "react-hook-form"

const options = [
  {
    value: "NEVER",
    text: "never",
  },
  {
    value: "INSTANT",
    text: "instantly",
  },
  {
    value: "SLOW",
    text: "in 7 days",
  },
]

const Option = ({ children, ...props }: PropsWithChildren<UseRadioProps>) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { isChecked } = props

  const { colorMode } = useColorMode()

  return (
    <Button
      borderRadius="md"
      h="10"
      as="label"
      {...checkbox}
      boxShadow="none !important"
      colorScheme={isChecked ? "indigo" : "gray"}
      bgColor={colorMode === "light" && !isChecked ? "white" : undefined}
      _active={isChecked ? { bg: null } : undefined}
      _hover={isChecked ? { bg: null } : undefined}
      cursor="pointer"
    >
      <input {...input} />
      {children}
    </Button>
  )
}

const UnauthenticatedOptions = () => {
  const { index } = useRolePlatform()
  const { field: activationIntervalField } = useController({
    name: `rolePlatforms.${index}.platformRoleData.activationInterval`,
  })
  const { field: includeUnauthenticatedField } = useController({
    name: `rolePlatforms.${index}.platformRoleData.includeUnauthenticated`,
  })

  const { getRootProps, getRadioProps, value } = useRadioGroup({
    onChange: (newValue) => {
      activationIntervalField.onChange(+(newValue === "SLOW") * 7)
      includeUnauthenticatedField.onChange(newValue !== "NEVER")
    },
    value:
      (!includeUnauthenticatedField.value && "NEVER") ||
      (activationIntervalField.value === 0 && "INSTANT") ||
      "SLOW",
  })

  const group = getRootProps()

  return (
    <Wrap {...group}>
      {options.map(({ value: optionValue, text }) => {
        const radio = getRadioProps({ value: optionValue })
        return (
          <Option key={optionValue} {...radio}>
            {text}
          </Option>
        )
      })}
    </Wrap>
  )
}

export default UnauthenticatedOptions
