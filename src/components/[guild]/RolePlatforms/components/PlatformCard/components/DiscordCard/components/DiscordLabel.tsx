import { Text } from "@chakra-ui/react"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { useEffect, useMemo } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import pluralize from "utils/pluralize"

const DiscordLabel = ({ isAdded = false }: { isAdded?: boolean }) => {
  const { index, guildPlatform, platformRoleId } = useRolePlatform()
  const { authorization } = useDCAuth("guilds")
  const roleType = useWatch({ name: "roleType" })

  const {
    data: { roles, categories },
  } = useServerData(guildPlatform.platformGuildId, { authorization })

  const rolesById = useMemo(
    () => Object.fromEntries(roles.map((role) => [role.id, role])),
    [roles]
  )

  const gatedChannels = useWatch({
    name: `rolePlatforms.${index}.platformRoleData.gatedChannels`,
    defaultValue: {},
  })

  const isGuarded = useWatch({
    name: `rolePlatforms.${index}.platformRoleData.isGuarded`,
  })

  const numOfGatedChannels = useMemo(
    () =>
      Object.values(gatedChannels ?? {})
        .flatMap(
          ({ channels }) =>
            Object.values(channels ?? {}).map(({ isChecked }) => +isChecked) ?? []
        )
        .reduce((acc, curr) => acc + curr, 0),
    [gatedChannels]
  )

  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  useEffect(() => {
    if (!categories || categories.length <= 0) return

    setValue(
      `rolePlatforms.${index}.platformRoleData.gatedChannels`,
      Object.fromEntries(
        categories.map(({ channels, id, name }) => [
          id,
          {
            name,
            channels: Object.fromEntries(
              (channels ?? []).map((channel) => [
                channel.id,
                {
                  name: channel.name,
                  isChecked: touchedFields.gatedChannels?.[id]?.channels?.[
                    channel.id
                  ]
                    ? gatedChannels?.[id]?.channels?.[channel.id]?.isChecked
                    : channel.roles.includes(platformRoleId),
                },
              ])
            ),
          },
        ])
      )
    )
  }, [categories, platformRoleId])

  return (
    <Text>
      {isAdded &&
        ((roleType === "NEW" && "Create a new role for me, ") ||
          `Guildify the ${
            (!!rolesById?.[platformRoleId]?.name &&
              ` "${rolesById[platformRoleId].name}"`) ||
            ""
          } role, `)}
      {isGuarded ? "Guard server" : pluralize(numOfGatedChannels, "gated channel")}
    </Text>
  )
}

export default DiscordLabel
