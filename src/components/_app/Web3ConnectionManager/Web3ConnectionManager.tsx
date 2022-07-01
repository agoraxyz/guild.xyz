import { useDisclosure } from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { WalletConnect } from "@web3-react/walletconnect"
import NetworkModal from "components/common/Layout/components/Account/components/NetworkModal/NetworkModal"
import { useRouter } from "next/router"
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react"
import WalletSelectorModal from "./components/WalletSelectorModal"
import useEagerConnect from "./hooks/useEagerConnect"

const Web3Connection = createContext<{
  isWalletSelectorModalOpen: boolean
  openWalletSelectorModal: () => void
  closeWalletSelectorModal: () => void
  triedEager: boolean
  isNetworkModalOpen: boolean
  openNetworkModal: () => void
  closeNetworkModal: () => void
  listedChainIDs: number[]
  setListedChainIDs: Dispatch<SetStateAction<number[]>>
}>({
  isWalletSelectorModalOpen: false,
  openWalletSelectorModal: () => {},
  closeWalletSelectorModal: () => {},
  triedEager: false,
  isNetworkModalOpen: false,
  openNetworkModal: () => {},
  closeNetworkModal: () => {},
  listedChainIDs: null,
  setListedChainIDs: () => {},
})

const Web3ConnectionManager = ({
  children,
}: PropsWithChildren<any>): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")

  const { connector, isActive } = useWeb3React()
  const [listedChainIDs, setListedChainIDs] = useState<number[]>(null)

  const {
    isOpen: isWalletSelectorModalOpen,
    onOpen: openWalletSelectorModal,
    onClose: closeWalletSelectorModal,
  } = useDisclosure()
  const {
    isOpen: isNetworkModalOpen,
    onOpen: openNetworkModal,
    onClose: closeNetworkModal,
  } = useDisclosure()
  const router = useRouter()

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  useEffect(() => {
    if (
      triedEager &&
      !isActive &&
      (router.query.discordId || router.query.focusGuard || router.query.redirectUrl)
    )
      openWalletSelectorModal()
  }, [triedEager, isActive, router.query])

  useEffect(() => {
    if (!isActive || !triedEager) return
    addDatadogAction("Successfully connected wallet")
  }, [isActive, triedEager])

  // Sending actions to datadog
  useEffect(() => {
    if (!connector) return
    if (connector instanceof MetaMask) {
      addDatadogAction(`Successfully connected wallet [Metamask]`)
    }
    if (connector instanceof WalletConnect)
      addDatadogAction(`Successfully connected wallet [WalletConnect]`)
    if (connector instanceof CoinbaseWallet)
      addDatadogAction(`Successfully connected wallet [CoinbaseWallet]`)
  }, [connector])

  const closeNetworkModalHandler = () => {
    closeNetworkModal()
    setListedChainIDs([])
  }

  return (
    <Web3Connection.Provider
      value={{
        isWalletSelectorModalOpen,
        openWalletSelectorModal,
        closeWalletSelectorModal,
        triedEager,
        isNetworkModalOpen,
        openNetworkModal,
        closeNetworkModal: closeNetworkModalHandler,
        listedChainIDs,
        setListedChainIDs,
      }}
    >
      {children}
      <WalletSelectorModal
        {...{
          isModalOpen: isWalletSelectorModalOpen,
          openModal: openWalletSelectorModal,
          closeModal: closeWalletSelectorModal,
          openNetworkModal: closeNetworkModalHandler,
        }}
      />
      <NetworkModal
        {...{
          isOpen: isNetworkModalOpen,
          onClose: closeNetworkModalHandler,
        }}
      />
    </Web3Connection.Provider>
  )
}
export { Web3Connection, Web3ConnectionManager }
