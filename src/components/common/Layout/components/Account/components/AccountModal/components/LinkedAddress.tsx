import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Alert } from "components/common/Modal"
import useUser from "components/[guild]/hooks/useUser"
import { TrashSimple } from "phosphor-react"
import { useEffect, useRef } from "react"
import shortenHex from "utils/shortenHex"
import useUpdateUser from "../hooks/useUpdateUser"

type Props = {
  address: string
}

const LinkedAddress = ({ address }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, response, isLoading, isSigning } = useUpdateUser()
  const alertCancelRef = useRef()

  const { addresses }: any = useUser()

  const removeAddress = () =>
    onSubmit({
      addresses: addresses.filter((_address) => _address !== address),
    })

  useEffect(() => {
    if (response) onClose()
  }, [response, onClose])

  return (
    <>
      <HStack spacing={6} alignItems="center" w="full">
        <GuildAvatar address={address} size={6} />
        <CopyableAddress address={address} decimals={5} fontSize="md" />
        <Tooltip label="Remove address" placement="top" hasArrow>
          <IconButton
            rounded="full"
            variant="ghost"
            size="sm"
            icon={<Icon as={TrashSimple} />}
            colorScheme="red"
            ml="auto !important"
            onClick={onOpen}
            aria-label="Remove address"
          />
        </Tooltip>
      </HStack>
      <Alert {...{ isOpen, onClose }} leastDestructiveRef={alertCancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Remove address</AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You'll be kicked from the guilds you have the
              requirement(s) to with{" "}
              <Text as="span" fontWeight="semibold" whiteSpace="nowrap">
                {shortenHex(address, 3)}
              </Text>
              .
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={alertCancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={removeAddress}
                isLoading={isLoading}
                loadingText={isSigning ? "Check your wallet" : "Removing"}
                ml={3}
              >
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </>
  )
}

export default LinkedAddress
