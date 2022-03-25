import {
  Flex,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import usePopupWindow from "hooks/usePopupWindow"
import { ArrowSquareOut, CheckCircle } from "phosphor-react"
import QRCode from "qrcode.react"
import { useEffect } from "react"
import platformsContent from "../../platformsContent"
import DCAuthButton from "./components/DCAuthButton"
import useJoinPlatform from "./hooks/useJoinPlatform"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const JoinDiscordModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const {
    title,
    join: { description },
  } = platformsContent.DISCORD
  const { onOpen } = usePopupWindow()
  const {
    response,
    isLoading,
    onSubmit,
    error: joinError,
    isSigning,
  } = useJoinPlatform("DISCORD", "")

  const closeModal = () => {
    // authSend("CLOSE_MODAL")
    onClose()
  }

  const handleJoin = async () => {
    // authSend("HIDE_NOTIFICATION")
    onSubmit()
  }

  useEffect(() => {
    window.open(
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&scope=identify&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}&state=mobile-testing`,
      "_blank",
      "height=750,width=600,scrollbars"
    )
  }, [])

  // if addressSignedMessage is already known, submit useJoinPlatform on DC auth
  /* useEffect(() => {
    if (
      authState.matches({ idKnown: "successNotification" }) &&
      addressSignedMessage
    )
      onSubmit()
  }, [authState]) */

  // if both addressSignedMessage and DC is already known, submit useJoinPlatform on modal open
  /* useEffect(() => {
    if (isOpen && addressSignedMessage && authState.matches("idKnown") && !response)
      onSubmit()
  }, [isOpen]) */

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error error={joinError} processError={processJoinPlatformError} />
          {!response ? (
            <Text>{description}</Text>
          ) : (
            /** Negative margin bottom to offset the Footer's padding that's there anyway */
            <VStack spacing="6" mb="-8">
              {response.alreadyJoined ? (
                <Flex alignItems="center">
                  <Icon
                    as={CheckCircle}
                    color="green.500"
                    boxSize="16"
                    weight="light"
                  />
                  <Text ml="6">
                    Seems like you've already joined the Discord server, you should
                    get access to the correct channels soon!
                  </Text>
                </Flex>
              ) : (
                <>
                  <Text>Here’s your invite link:</Text>
                  <Link href={response.inviteLink} colorScheme="blue" isExternal>
                    {response.inviteLink}
                    <Icon as={ArrowSquareOut} mx="2" />
                  </Link>
                  <QRCode size={150} value={response.inviteLink} />
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {/* margin is applied on AuthButton, so there's no jump when it collapses and unmounts */}
          <VStack spacing="0" alignItems="strech" w="full">
            {!isLoading && !response && <DCAuthButton {...{ onOpen }} />}
            {(() => {
              if (!"")
                return (
                  <ModalButton disabled colorScheme="gray">
                    Verify address
                  </ModalButton>
                )
              if (isSigning)
                return <ModalButton isLoading loadingText="Check your wallet" />
              if (isLoading)
                return <ModalButton isLoading loadingText="Generating invite link" />
              if (joinError)
                return <ModalButton onClick={onSubmit}>Try again</ModalButton>
              if (!!"" && !response)
                return <ModalButton onClick={handleJoin}>Verify address</ModalButton>
            })()}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinDiscordModal
