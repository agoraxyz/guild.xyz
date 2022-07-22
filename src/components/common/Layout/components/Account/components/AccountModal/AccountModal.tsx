import {
  HStack,
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
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { WalletConnect } from "@web3-react/walletconnect"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import useUser from "components/[guild]/hooks/useUser"
import { deleteKeyPairFromIdb } from "hooks/useKeyPair"
import { SignOut } from "phosphor-react"
import AccountConnections from "./components/AccountConnections"

const AccountModal = ({ isOpen, onClose }) => {
  const { account, connector } = useWeb3React()
  const { isLoading, platformUsers, addresses, id } = useUser()
  const modalFooterBg = useColorModeValue("gray.100", "gray.800")

  const connectorName = (c) =>
    c instanceof MetaMask
      ? "MetaMask"
      : c instanceof WalletConnect
      ? "WalletConnect"
      : c instanceof CoinbaseWallet
      ? "Coinbase Wallet"
      : ""

  const handleLogout = () => {
    connector.deactivate()

    const keysToRemove = Object.keys({ ...window.localStorage }).filter((key) =>
      /^dc_auth_[a-z]*$/.test(key)
    )

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key)
    })

    deleteKeyPairFromIdb(id).catch(() => {})
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack mb={9} direction="row" spacing="4" alignItems="center">
            <GuildAvatar address={account} />
            <CopyableAddress address={account} decimals={5} fontSize="2xl" />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb="-1"
          >
            <Text colorScheme="gray" fontSize="sm" fontWeight="medium">
              {`Connected with ${connectorName(connector)}`}
            </Text>
            <HStack>
              <Tooltip label="Disconnect">
                <IconButton
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  icon={<Icon as={SignOut} p="1px" />}
                  aria-label="Disconnect"
                />
              </Tooltip>
            </HStack>
          </Stack>
        </ModalBody>
        {(isLoading || platformUsers || addresses) && (
          <ModalFooter bg={modalFooterBg} flexDir="column" pt="10">
            <AccountConnections />
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AccountModal
