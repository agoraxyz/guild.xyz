import {
  Box,
  Icon,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import {
  useRumAction,
  WithRumComponentContext,
} from "@datadog/rum-react-integration"
import MetaMaskOnboarding from "@metamask/onboarding"
import { useWeb3React } from "@web3-react/core"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Error } from "components/common/Error"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import { connectors } from "connectors"
import { AnimateSharedLayout } from "framer-motion"
import useKeyPair from "hooks/useKeyPair"
import { ArrowLeft, ArrowSquareOut } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import { WalletError } from "types"
import ConnectorButton from "./components/ConnectorButton"
import processConnectionError from "./utils/processConnectionError"

type Props = {
  isModalOpen: boolean
  closeModal: () => void
  openModal: () => void
}

const WalletSelectorModal = ({
  isModalOpen,
  closeModal,
  openModal,
}: Props): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")

  const { isActive, account, connector } = useWeb3React()
  const [error, setError] = useState<WalletError & Error>(null)

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }

  const closeModalAndSendAction = () => {
    closeModal()
    addDatadogAction("Wallet selector modal closed")
    setTimeout(() => {
      connector.deactivate()
    }, 200)
  }

  const { ready, set, keyPair } = useKeyPair()

  useEffect(() => {
    if (keyPair) closeModal()
  }, [keyPair])

  useEffect(() => {
    if (ready && !keyPair) {
      const activate = connector.activate()
      if (typeof activate !== "undefined") {
        activate.finally(() => openModal())
      }
    }
  }, [keyPair, ready])

  const isConnected = account && isActive && ready

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModalAndSendAction}
        closeOnOverlayClick={!isActive || !!keyPair}
        closeOnEsc={!isActive || !!keyPair}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"}>
            <Box
              {...(isConnected && !keyPair
                ? {
                    w: "10",
                    opacity: 1,
                  }
                : {
                    w: "0",
                    opacity: 0,
                  })}
              transition="width .2s, opacity .2s"
              overflow="hidden"
              mt="-1px"
            >
              <IconButton
                rounded={"full"}
                aria-label="Back"
                size="sm"
                icon={<ArrowLeft size={20} />}
                variant="ghost"
                onClick={() => connector.deactivate()}
              />
            </Box>
            <Text>Connect wallet</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error error={error} processError={processConnectionError} />
            {isConnected && !keyPair && (
              <Text mb="6" animation={"fadeIn .3s .1s both"}>
                Sign message to verify that you're the owner of this account.
              </Text>
            )}
            <Stack spacing="0">
              <AnimateSharedLayout>
                {connectors.map(([conn, connectorHooks], index) => (
                  <CardMotionWrapper key={conn.toString()}>
                    <ConnectorButton
                      connector={conn}
                      connectorHooks={connectorHooks}
                      error={error}
                      setError={setError}
                    />
                  </CardMotionWrapper>
                ))}
              </AnimateSharedLayout>
            </Stack>
            {isConnected && !keyPair && (
              <Box animation={"fadeIn .3s .1s both"}>
                <ModalButton
                  size="xl"
                  mb="4"
                  colorScheme={"green"}
                  onClick={set.onSubmit}
                  isLoading={set.isLoading || !ready}
                  isDisabled={!ready}
                  loadingText={
                    !ready
                      ? "Looking for key pairs"
                      : set.signLoadingText || "Check your wallet"
                  }
                >
                  Verify account
                </ModalButton>
              </Box>
            )}
          </ModalBody>
          <ModalFooter mt="-4">
            {!isConnected ? (
              <Text textAlign="center" w="full" colorScheme={"gray"}>
                New to Ethereum wallets?{" "}
                <Link
                  colorScheme="blue"
                  href="https://ethereum.org/en/wallets/"
                  isExternal
                >
                  Learn more
                  <Icon as={ArrowSquareOut} mx="1" />
                </Link>
              </Text>
            ) : (
              <Text textAlign="center" w="full" colorScheme={"gray"}>
                Signing the message doesn't cost any gas
              </Text>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WithRumComponentContext("WalletSelectorModal", WalletSelectorModal)
