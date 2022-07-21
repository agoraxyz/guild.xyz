import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import RadioSelect from "components/common/RadioSelect"
import { useController, useFormState } from "react-hook-form"
import ExistingRoleIcon from "../../../../../../AddRoleButton/components/ExistingRoleIcon"
import ExistingRoleSettings from "../../../../../../AddRoleButton/components/ExistingRoleSettings"
import NewRoleIcon from "../../../../../../AddRoleButton/components/NewRoleIcon"

const roleOptions = [
  {
    value: "NEW",
    title: "Create a new Discord role for me",
    icon: NewRoleIcon,
  },
  {
    value: "EXISTING",
    title: "Guildify an already existing role on my server",
    icon: ExistingRoleIcon,
    children: <ExistingRoleSettings />,
  },
]

const RoleToManage = () => {
  const { errors } = useFormState()

  const { field } = useController({
    name: "roleType",
  })

  return (
    <FormControl isInvalid={!!errors?.platform}>
      <FormLabel>Role to manage</FormLabel>
      <RadioSelect
        options={roleOptions}
        colorScheme="DISCORD"
        name="roleType"
        onChange={field.onChange}
        value={field.value}
      />
      <FormErrorMessage>{errors?.platform?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default RoleToManage
