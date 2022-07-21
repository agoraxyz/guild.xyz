import { UseRadioGroupProps } from "@chakra-ui/react"
import RadioSelect from "components/common/RadioSelect"
import { CircleWavyCheck, UserCircleMinus } from "phosphor-react"

type Props = {
  keepAccessDescription: string
  revokeAccessDescription: string
  // temporary
  disableRevokeAccess?: string
} & UseRadioGroupProps

const ShouldKeepPlatformAccesses = ({
  keepAccessDescription,
  revokeAccessDescription,
  disableRevokeAccess,
  onChange,
  value,
}: Props) => {
  const options = [
    {
      value: 0,
      title: "Keep accesses",
      description: keepAccessDescription,
      icon: CircleWavyCheck,
    },
    {
      value: 1,
      title: "Revoke accesses",
      description: revokeAccessDescription,
      icon: UserCircleMinus,
      disabled: disableRevokeAccess,
    },
  ]

  return (
    <RadioSelect
      options={options}
      colorScheme="DISCORD"
      name={`removePlatformAccess`}
      {...{ onChange, value }}
    />
  )
}

export default ShouldKeepPlatformAccesses
