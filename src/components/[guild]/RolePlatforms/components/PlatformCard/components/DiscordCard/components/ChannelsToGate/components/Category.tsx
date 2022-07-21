import { Checkbox, Stack } from "@chakra-ui/react"
import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import Channel from "./Channel"

type Props = {
  rolePlatformIndex: number
  categoryId: string
  isGuarded: boolean
}

export type GatedChannels = Record<
  string,
  {
    name: string
    channels: Record<string, { name: string; isChecked: boolean }>
  }
>

const Category = ({ rolePlatformIndex, categoryId, isGuarded }: Props) => {
  const { setValue } = useFormContext()

  // TODO: typing
  const name = useWatch({
    name: `rolePlatforms.${rolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.name`,
  })

  const channels = useWatch({
    name: `rolePlatforms.${rolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.channels`,
  })

  const sumIsChecked = useMemo(
    () =>
      Object.values(channels ?? {}).reduce<number>(
        (acc, curr: any) => acc + +curr.isChecked,
        0
      ),
    [channels]
  )

  const channelsLength = Object.keys(channels ?? {}).length

  return (
    <>
      {categoryId !== "-" && (
        <Checkbox
          isChecked={isGuarded || sumIsChecked === channelsLength}
          isDisabled={isGuarded}
          isIndeterminate={sumIsChecked > 0 && sumIsChecked < channelsLength}
          onChange={(e) => {
            Object.entries(channels).forEach(
              ([channelId, { name: channelName }]: any) => {
                setValue(
                  `rolePlatforms.${rolePlatformIndex}.platformRoleData.gatedChannels.${categoryId}.channels.${channelId}`,
                  {
                    name: channelName,
                    isChecked: e.target.checked,
                  },
                  { shouldTouch: true }
                )
              }
            )
          }}
        >
          {name}
        </Checkbox>
      )}

      <Stack pl={categoryId !== "-" ? 6 : 0} mt={1} spacing={1}>
        {Object.keys(channels ?? {}).map((channelId) => (
          <Channel
            key={channelId}
            rolePlatformIndex={rolePlatformIndex}
            categoryId={categoryId}
            channelId={channelId}
            isGuarded={isGuarded}
          />
        ))}
      </Stack>
    </>
  )
}

export default Category
