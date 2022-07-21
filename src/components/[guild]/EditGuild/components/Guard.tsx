import {
  Box,
  Checkbox,
  FormLabel,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Disclaimer from "components/guard/setup/ServerSetupCard/components/Disclaimer"
import PickSecurityLevel from "components/guard/setup/ServerSetupCard/components/PickSecurityLevel"
import useGuild from "components/[guild]/hooks/useGuild"
import SendDiscordJoinButtonModal from "components/[guild]/Onboarding/components/SummonMembers/components/SendDiscordJoinButtonModal"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useServerData from "hooks/useServerData"
import { ArrowSquareIn, Info } from "phosphor-react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { useSWRConfig } from "swr"

const Guard = () => {
  const { index, guildPlatform } = useRolePlatform()
  const { register, setValue } = useFormContext()
  const { mutate } = useSWRConfig()
  const { urlName } = useGuild()

  const {
    data: { channels },
    mutate: mutateChannels,
  } = useServerData(guildPlatform.platformGuildId)

  const entryChannel = channels?.find(
    (channel) => channel.id === guildPlatform?.platformGuildData?.inviteChannel
  )?.name
  const hasJoinButton = guildPlatform?.platformGuildData?.joinButton !== false

  const isGuarded = useWatch({
    name: `rolePlatforms.${index}.platformRoleData.isGuarded`,
  })

  const { isOpen, onClose, onOpen } = useDisclosure()

  const { dirtyFields } = useFormState()

  const isOn =
    (isGuarded &&
      !dirtyFields.rolePlatforms?.[index]?.platformRoleData?.isGuarded) ||
    (!isGuarded && dirtyFields.rolePlatforms?.[index]?.platformRoleData?.isGuarded)

  const handleOpen = () => {
    setValue(`rolePlatforms.${index}.platformRoleData.isGuarded`, true)
    onOpen()
  }

  const handleClose = () => {
    onClose()
    if (isOn) return
    setValue(`rolePlatforms.${index}.platformRoleData.isGuarded`, false)
    setValue(
      `rolePlatforms.${index}.platformRoleData.grantAccessToExistingUsers`,
      undefined
    )
  }

  const {
    isOpen: isEntryChannelModalOpen,
    onOpen: onEntryChannelModalOpen,
    onClose: onEntryChannelModalClose,
  } = useDisclosure()

  const borderColor = useColorModeValue("gray.200", "whiteAlpha.300")

  return (
    <>
      <Checkbox
        flexGrow={0}
        size="sm"
        spacing={1}
        defaultChecked={isOn}
        {...register(`rolePlatforms.${index}.platformRoleData.isGuarded`, {
          onChange: (e) => !!e.target.checked && onOpen(),
        })}
        isChecked={isGuarded}
      >
        <Text as="span" colorScheme={"gray"} d="inline-flex" fontWeight={"medium"}>
          Guard whole server
        </Text>
      </Checkbox>
      <IconButton
        variant={"ghost"}
        onClick={handleOpen}
        size="xs"
        icon={<ArrowSquareIn />}
        aria-label="Open guard settings"
        ml="2px !important"
      />
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        closeOnOverlayClick={!!isOn}
        colorScheme="dark"
      >
        <ModalOverlay />
        <ModalContent minW={{ base: "auto", md: "3xl" }}>
          <ModalHeader>Guild Guard</ModalHeader>
          <ModalBody>
            <Stack spacing={8}>
              <Text>
                Quarantine newly joined accounts in the entry channel until they
                authenticate with Guild. This way bots can't raid and spam your
                server, or the members in DM.
              </Text>
              <Box>
                <FormLabel d="flex" alignItems="center">
                  <Text as="span" mr="2">
                    Entry channel
                  </Text>
                  {/* not focusable so it doesn't automatically open on Guard modal open */}
                  <Tooltip
                    label={
                      "Newly joined accounts will only see this on your server until they authenticate"
                    } /* shouldWrapChildren */
                  >
                    <Info />
                  </Tooltip>
                </FormLabel>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing="4"
                  border="1px"
                  py="3"
                  px="5"
                  borderRadius={"xl"}
                  borderColor={borderColor}
                  justifyContent={"space-between"}
                  alignItems={{ md: "center" }}
                >
                  <Text fontWeight={"bold"}>
                    {hasJoinButton ? `# ${entryChannel}` : "Not set yet"}
                  </Text>
                  <Button
                    colorScheme={!hasJoinButton ? "DISCORD" : "gray"}
                    onClick={onEntryChannelModalOpen}
                    isDisabled={isOn}
                  >
                    {!hasJoinButton
                      ? "Set entry channel with join button"
                      : "Change"}
                  </Button>
                </Stack>
                <SendDiscordJoinButtonModal
                  serverId={guildPlatform.platformGuildId}
                  isOpen={isEntryChannelModalOpen}
                  onClose={onEntryChannelModalClose}
                  onSuccess={() => {
                    onEntryChannelModalClose()
                    mutate([`/guild/${urlName}`, undefined])
                    mutateChannels()
                  }}
                />
              </Box>
              {!isOn && <PickSecurityLevel rolePlatformIndex={index} />}
              <Disclaimer />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button colorScheme="gray" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={onClose}
                isDisabled={!hasJoinButton}
              >
                Done
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Guard
