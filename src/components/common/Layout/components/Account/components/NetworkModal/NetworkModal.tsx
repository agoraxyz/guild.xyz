import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Error } from "components/common/Error"
import Modal from "components/common/Modal"
import processConnectionError from "components/_app/Web3ConnectionManager/components/WalletSelectorModal/utils/processConnectionError"
import { supportedChains, walletConnect } from "connectors"
import useToast from "hooks/useToast"
import NetworkButton from "./components/NetworkButton"
import requestNetworkChange from "./utils/requestNetworkChange"

const NetworkModal = ({ isOpen, onClose }) => {
  const { error, connector, active } = useWeb3React()
  const toast = useToast()

  const requestManualNetworkChange = (chain) => () =>
    toast({
      title: "Your wallet doesn't support switching chains automatically",
      description: `Please switch to ${chain} from your wallet manually!`,
      status: "error",
    })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{active ? "Supported networks" : "Select network"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={6}>
            It doesn't matter which supported chain you're connected to, it's only
            used to know your address and sign messages so each will work equally.
          </Text>
          <Error error={error} processError={processConnectionError} />
          <Stack spacing={3}>
            {supportedChains.map((chain) => (
              <NetworkButton
                key={chain}
                chain={chain}
                requestNetworkChange={
                  connector === walletConnect
                    ? requestManualNetworkChange(chain)
                    : requestNetworkChange(chain, onClose)
                }
              />
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NetworkModal
