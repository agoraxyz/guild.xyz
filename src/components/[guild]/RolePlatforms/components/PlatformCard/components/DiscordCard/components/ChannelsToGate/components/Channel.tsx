import { Checkbox } from "@chakra-ui/react"
import { useController, useWatch } from "react-hook-form"

type Props = {
  rolePlatformIndex: number
  categoryId: string
  channelId: string
  isGuarded: boolean
}

const Channel = ({ rolePlatformIndex, categoryId, channelId, isGuarded }: Props) => {
  const {
    field: { name: fieldName, onBlur, onChange, ref },
  } = useController({
    name: `rolePlatforms.${rolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.channels.${channelId}`,
  })

  const isChecked = useWatch({
    name: `rolePlatforms.${rolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.channels.${channelId}.isChecked`,
  })

  const name = useWatch({
    name: `rolePlatforms.${rolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.channels.${channelId}.name`,
  })

  return (
    <Checkbox
      name={fieldName}
      ref={ref}
      onBlur={onBlur}
      isChecked={isGuarded || isChecked}
      isDisabled={isGuarded}
      onChange={(e) => onChange({ name, isChecked: e.target.checked })}
    >
      {name}
    </Checkbox>
  )
}

export default Channel
