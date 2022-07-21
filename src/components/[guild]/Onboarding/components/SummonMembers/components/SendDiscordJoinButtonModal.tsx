import {
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import EntryChannel from "components/create-guild/EntryChannel"
import useGuild from "components/[guild]/hooks/useGuild"
import useDebouncedState from "hooks/useDebouncedState"
import useServerData from "hooks/useServerData"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useSendJoin from "../hooks/useSendJoin"
import { SummonMembersForm } from "../SummonMembers"
import PanelBody from "./PanelBody"
import PanelButton from "./PanelButton"

const SendDiscordJoinButtonModal = ({ isOpen, onClose, onSuccess, serverId }) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const { isLoading, isSigning, onSubmit, signLoadingText } = useSendJoin(
    "JOIN",
    onSuccess
  )

  const loadingText = signLoadingText || "Sending"

  const { description, name } = useGuild()
  const {
    data: { channels },
  } = useServerData(serverId)

  const methods = useForm<SummonMembersForm>({
    mode: "onSubmit",
    defaultValues: {
      title: "Verify your wallet",
      description: description || "Join this guild and get your role(s)!",
      button: `Join ${name ?? "Guild"}`,
      channelId: "0",
      serverId,
    },
  })

  const handleClose = () => {
    methods.reset()
    onClose()
  }

  const isDirty = useDebouncedState(methods.formState.isDirty)

  useEffect(() => {
    if (!isDirty) return
    addDatadogAction("modified dc embed")
  }, [isDirty])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="lg">
        <ModalHeader>Send Discord join button</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb="8">
            The bot will send a join button as an entry point for Discord users to
            join your guild. Feel free to customize it below!
          </Text>

          <FormProvider {...methods}>
            <EntryChannel
              channels={channels}
              label="Channel to send to"
              tooltip="Users won't be able to send messages here so the button doesn't get spammed away"
              showCreateOption
              maxW="sm"
              withAction
              fieldName="channelId"
              errorMessage={methods.formState.errors.channelId?.message}
            />

            <FormControl isInvalid={!!Object.keys(methods.formState.errors).length}>
              <FormLabel mt="6">Customize panel & button text</FormLabel>
              <PanelBody />
              <PanelButton />
              <FormErrorMessage>Some fields are empty</FormErrorMessage>
            </FormControl>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            mr="2"
            data-dd-action-name="Cancel [discord join button]"
          >
            Cancel
          </Button>
          <Button
            colorScheme="green"
            onClick={methods.handleSubmit((data) => {
              addDatadogAction("click on Send [discord join button]")
              onSubmit(data)
            }, console.log)}
            isLoading={isLoading || isSigning}
            loadingText={loadingText}
            isDisabled={isLoading || isSigning}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SendDiscordJoinButtonModal
