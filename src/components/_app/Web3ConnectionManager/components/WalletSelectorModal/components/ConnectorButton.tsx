import { Img } from "@chakra-ui/react"
import { useRumError } from "@datadog/rum-react-integration"
import MetaMaskOnboarding from "@metamask/onboarding"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React, Web3ReactHooks } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { WalletConnect } from "@web3-react/walletconnect"
import Button from "components/common/Button"
import GuildAvatar from "components/common/GuildAvatar"
import useKeyPair from "hooks/useKeyPair"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { isMobile } from "react-device-detect"
import { WalletError } from "types"
import shortenHex from "utils/shortenHex"

type Props = {
  connector: MetaMask | WalletConnect | CoinbaseWallet
  connectorHooks: Web3ReactHooks
  error: WalletError & Error
  setError: Dispatch<SetStateAction<WalletError & Error>>
}

const ConnectorButton = ({
  connector,
  connectorHooks,
  error,
  setError,
}: Props): JSX.Element => {
  const addDatadogError = useRumError()

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }
  const handleOnboarding = () => onboarding.current?.startOnboarding()

  const {
    connector: activeConnector,
    account,
    isActive: isAnyConnectorActive,
  } = useWeb3React()
  const { useIsActive } = connectorHooks
  const isActive = useIsActive()
  const { ready } = useKeyPair()

  const [isActivating, setIsActivating] = useState(false)

  const activate = () => {
    setError(null)
    setIsActivating(true)
    activeConnector?.deactivate()
    connector
      .activate()
      .catch((err) => {
        setError(err)
        addDatadogError("Wallet connection error", { error: err }, "custom")
      })
      .finally(() => setIsActivating(false))
  }

  const isMetaMaskInstalled =
    typeof window !== "undefined" && MetaMaskOnboarding.isMetaMaskInstalled()

  const iconUrl =
    connector instanceof MetaMask
      ? "metamask.png"
      : connector instanceof WalletConnect
      ? "walletconnect.svg"
      : "coinbasewallet.png"

  const connectorName =
    connector instanceof MetaMask
      ? isMetaMaskInstalled
        ? "MetaMask"
        : "Install MetaMask"
      : connector instanceof WalletConnect
      ? "WalletConnect"
      : "Coinbase Wallet"

  if (connector instanceof MetaMask && isMobile && !isMetaMaskInstalled) return null

  if (connector instanceof WalletConnect && isMobile && isMetaMaskInstalled)
    return null

  if (account && !isActive && ready && isAnyConnectorActive) return null

  return (
    <Button
      mb="4"
      onClick={
        connector instanceof MetaMask && !isMetaMaskInstalled
          ? handleOnboarding
          : activate
      }
      rightIcon={
        isActive && ready ? (
          <GuildAvatar address={account} size={5} />
        ) : (
          <Img
            src={`/walletLogos/${iconUrl}`}
            boxSize={6}
            alt={`${connectorName} logo`}
          />
        )
      }
      disabled={
        isActivating ||
        (account && isActive && !ready) ||
        (isActive && activeConnector.constructor === connector.constructor)
      }
      isLoading={(isActivating || (account && isActive && !ready)) && !error}
      spinnerPlacement="end"
      loadingText={`${connectorName} - connecting...`}
      isFullWidth
      size="xl"
      justifyContent="space-between"
      border={isActive && "2px"}
      borderColor="primary.500"
    >
      {!account || !isActive ? `${connectorName}` : shortenHex(account)}
    </Button>
  )
}

export default ConnectorButton
