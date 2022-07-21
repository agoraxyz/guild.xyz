import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormLabel,
  HStack,
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/react"
import Guard from "components/[guild]/EditGuild/components/Guard"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { Info, LockSimple } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import Category from "./components/Category"

const ChannelsToGate = () => {
  const { roles } = useGuild()
  const { guildPlatform, index, platformRoleData } = useRolePlatform()
  const { authorization, onOpen: onAuthOpen, isAuthenticating } = useDCAuth("guilds")
  const {
    data: { categories },
  } = useServerData(guildPlatform.platformGuildId, {
    authorization,
  })

  const roleId = useWatch({
    name: `rolePlatforms.${index}.platformRoleId`,
  })
  const isGuarded = useWatch({
    name: `rolePlatforms.${index}.platformRoleData.isGuarded`,
  })

  const hasGuardedRole = roles.some(
    (role) =>
      role.rolePlatforms?.find(
        (platform) => platform.guildPlatformId === guildPlatform.id
      )?.platformRoleData?.isGuarded
  )

  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  const gatedChannels = useWatch({
    name: `rolePlatforms.${index}.platformRoleData.gatedChannels`,
  })

  const btnProps: ButtonProps = {
    w: "full",
    h: 12,
    justifyContent: "space-between",
  }

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
                  isChecked: touchedFields.rolePlatforms?.[index]?.platformRoleData
                    ?.gatedChannels?.[id]?.channels?.[channel.id]
                    ? gatedChannels?.[id]?.channels?.[channel.id]?.isChecked
                    : channel.roles.includes(roleId),
                },
              ])
            ),
          },
        ])
      )
    )
  }, [categories, roleId])

  return (
    <FormControl>
      {/* dummy htmlFor, so clicking it doesn't toggle the first checkbox */}
      <Wrap as="div" mb="2">
        <HStack>
          <FormLabel htmlFor="-" m="0">
            <Text as="span">Channels to gate</Text>
          </FormLabel>
          <Tooltip
            label="Choose the channels / categories you want only members with this role to see"
            shouldWrapChildren
          >
            <Info />
          </Tooltip>
        </HStack>
        {(!hasGuardedRole || platformRoleData?.isGuarded) && (
          <HStack ml={{ base: "auto !important", sm: "unset !important" }}>
            <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
              {`- or `}
            </Text>
            <Guard />
          </HStack>
        )}
      </Wrap>
      {!authorization?.length ? (
        <Button
          onClick={onAuthOpen}
          isLoading={isAuthenticating}
          loadingText="Check the popup window"
          spinnerPlacement="end"
          rightIcon={<LockSimple />}
          variant="outline"
          {...btnProps}
        >
          Authenticate to view channels
        </Button>
      ) : (categories ?? []).length <= 0 ? (
        <Button isDisabled isLoading loadingText="Loading channels" w="full" />
      ) : (
        <Box maxH="sm" overflowY={"auto"} px={2}>
          {Object.keys(gatedChannels ?? {}).map((categoryId) => (
            <Category
              key={categoryId}
              rolePlatformIndex={index}
              categoryId={categoryId}
              isGuarded={isGuarded}
            />
          ))}
        </Box>
      )}
    </FormControl>
  )
}

export default ChannelsToGate
