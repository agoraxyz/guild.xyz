import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { Web3ReactHooks } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { WalletConnect } from "@web3-react/walletconnect"
import initializeCoinbaseWalletConnector from "./coinbaseWallet"
import initializeMetaMaskConnector from "./metaMask"
import initializeWalletConnectConnector from "./walletConnect"

const supportedChains = [
  "ETHEREUM",
  "POLYGON",
  "AVALANCHE",
  "GNOSIS",
  "FANTOM",
  "ARBITRUM",
  "CELO",
  "HARMONY",
  "BSC",
  "OPTIMISM",
  "MOONBEAM",
  "MOONRIVER",
  "METIS",
  "CRONOS",
  "BOBA",
  "PALM",
  "RINKEBY",
  "GOERLI",
]

enum Chains {
  ETHEREUM = 1,
  BSC = 56,
  POLYGON = 137,
  AVALANCHE = 43114,
  GNOSIS = 100,
  FANTOM = 250,
  ARBITRUM = 42161,
  CELO = 42220,
  HARMONY = 1666600000,
  GOERLI = 5,
  OPTIMISM = 10,
  MOONBEAM = 1284,
  MOONRIVER = 1285,
  RINKEBY = 4,
  METIS = 1088,
  CRONOS = 25,
  BOBA = 288,
  PALM = 11297108109,
}

const RPC = {
  ETHEREUM: {
    chainId: 1,
    chainName: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000", // needed for proper form handling in the TokenFormCard component
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://etherscan.io"],
    iconUrls: ["/networkLogos/ethereum.svg"],
    rpcUrls: [
      process.env.ALCHEMY_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
        : "",
      "https://cloudflare-eth.com",
    ].filter((url) => !!url),
  },
  BSC: {
    chainId: 56,
    chainName: "BSC",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
    },
    rpcUrls: ["https://rpc-bsc.bnb48.club"],
    blockExplorerUrls: ["https://bscscan.com"],
    iconUrls: ["/networkLogos/bsc.svg"],
  },
  POLYGON: {
    chainId: 137,
    chainName: "Polygon",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    },
    rpcUrls: [
      process.env.ALCHEMY_KEY
        ? `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
        : "",
      "https://polygon-rpc.com",
    ].filter((url) => !!url),
    blockExplorerUrls: ["https://polygonscan.com"],
    iconUrls: ["/networkLogos/polygon.svg"],
  },
  AVALANCHE: {
    chainId: 43114,
    chainName: "Avalanche Mainnet",
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"],
    iconUrls: ["/networkLogos/avalanche.svg"],
  },
  GNOSIS: {
    chainId: 100,
    chainName: "Gnosis Chain",
    nativeCurrency: {
      name: "Gnosis",
      symbol: "Gnosis",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/11062/small/xdai.png?1614727492",
    },
    rpcUrls: ["https://rpc.gnosischain.com"],
    blockExplorerUrls: ["https://blockscout.com/xdai/mainnet"],
    iconUrls: ["/networkLogos/gnosis.svg"],
  },
  FANTOM: {
    chainId: 250,
    chainName: "Fantom Opera",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016",
    },
    rpcUrls: ["https://rpc.ftm.tools"],
    blockExplorerUrls: ["https://ftmscan.com"],
    iconUrls: ["/networkLogos/fantom.svg"],
  },
  ARBITRUM: {
    chainId: 42161,
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "Ether",
      symbol: "AETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
    iconUrls: ["/networkLogos/arbitrum.svg"],
  },
  CELO: {
    chainId: 42220,
    chainName: "Celo Mainnet",
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/11090/small/icon-celo-CELO-color-500.png?1592293590",
    },
    rpcUrls: ["https://forno.celo.org"],
    blockExplorerUrls: ["https://explorer.celo.org"],
    iconUrls: ["/networkLogos/celo.svg"],
  },
  HARMONY: {
    chainId: 1666600000,
    chainName: "Harmony",
    nativeCurrency: {
      name: "Harmony",
      symbol: "ONE",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4344/small/Y88JAze.png?1565065793",
    },
    rpcUrls: ["https://api.harmony.one"],
    blockExplorerUrls: ["https://explorer.harmony.one"],
    iconUrls: ["/networkLogos/harmony.svg"],
  },
  OPTIMISM: {
    chainId: 10,
    chainName: "Optimism",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    iconUrls: ["/networkLogos/optimism.svg"],
    rpcUrls: ["https://mainnet.optimism.io"],
  },
  MOONBEAM: {
    chainId: 1285,
    chainName: "Moonbeam",
    nativeCurrency: {
      name: "Moonbeam",
      symbol: "GLMR",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000", // needed for proper form handling in the TokenFormCard component
      logoURI:
        "https://assets.coingecko.com/coins/images/22459/small/glmr.png?1641880985",
    },
    blockExplorerUrls: ["https://moonbeam.moonscan.io"],
    iconUrls: ["/networkLogos/moonbeam.svg"],
    rpcUrls: ["https://rpc.api.moonbeam.network"],
  },
  MOONRIVER: {
    chainId: 1285,
    chainName: "Moonriver",
    nativeCurrency: {
      name: "Moonriver",
      symbol: "MOVR",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/17984/small/9285.png?1630028620",
    },
    blockExplorerUrls: ["https://moonriver.moonscan.io"],
    iconUrls: ["/networkLogos/moonriver.svg"],
    rpcUrls: ["https://rpc.api.moonriver.moonbeam.network"],
  },
  METIS: {
    chainId: 1088,
    chainName: "Metis Andromeda",
    nativeCurrency: {
      name: "Metis",
      symbol: "METIS",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/15595/small/metis.PNG?1621298076",
    },
    blockExplorerUrls: ["https://andromeda-explorer.metis.io"],
    iconUrls: ["/networkLogos/metis.svg"],
    rpcUrls: ["https://andromeda.metis.io/?owner=1088"],
  },
  CRONOS: {
    chainId: 25,
    chainName: "Cronos Mainnet",
    nativeCurrency: {
      name: "Cronos",
      symbol: "CRO",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/7310/small/oCw2s3GI_400x400.jpeg?1645172042",
    },
    blockExplorerUrls: ["https://cronos.org/explorer"],
    iconUrls: ["/networkLogos/cronos.svg"],
    rpcUrls: ["https://evm.cronos.org"],
  },
  BOBA: {
    chainId: 288,
    chainName: "Boba Network",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://blockexplorer.boba.network"],
    iconUrls: ["/networkLogos/boba.svg"],
    rpcUrls: ["https://mainnet.boba.network"],
  },
  PALM: {
    chainId: 11297108109,
    chainName: "Palm",
    nativeCurrency: {
      name: "Palm",
      symbol: "PALM",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI: "/networkLogos/palm.png",
    },
    blockExplorerUrls: ["https://explorer.palm.io"],
    iconUrls: ["/networkLogos/palm.png"],
    rpcUrls: ["https://palm-mainnet.infura.io/v3/84722b0c96da4e09a6305118494aeeaa"],
  },
  RINKEBY: {
    chainId: 4,
    chainName: "Rinkeby",
    nativeCurrency: {
      name: "Rinkeby Ether",
      symbol: "rETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://rinkeby.etherscan.io"],
    iconUrls: ["/networkLogos/ethereum.svg"],
    rpcUrls: ["https://rinkeby-light.eth.linkpool.io"],
  },
  GOERLI: {
    chainId: 5,
    chainName: "Goerli",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: [
      process.env.ALCHEMY_KEY
        ? `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
        : "",
      "https://ethereum-goerli-rpc.allthatnode.com/",
    ].filter((url) => !!url),
    blockExplorerUrls: ["https://goerli.etherscan.io"],
    iconUrls: ["/networkLogos/ethereum.svg"],
  },
}

const RPC_URLS = {}

supportedChains.forEach(
  (chain) => (RPC_URLS[RPC[chain].chainId] = RPC[chain].rpcUrls)
)

const blockExplorerIcons = {
  "https://etherscan.io": {
    light: "/explorerLogos/etherscan-light.svg",
    dark: "/explorerLogos/etherscan-dark.svg",
  },
  "https://bscscan.com": {
    light: "/explorerLogos/bscscan-light.svg",
    dark: "/explorerLogos/bscscan-dark.svg",
  },
  "https://polygonscan.com": {
    light: "/networkLogos/polygon.svg",
    dark: "/networkLogos/polygon.svg",
  },
  "https://snowtrace.io": {
    light: "/explorerLogos/snowtrace.svg",
    dark: "/explorerLogos/snowtrace.svg",
  },
  "https://blockscout.com/xdai/mainnet": {
    light: "/networkLogos/gnosis.svg",
    dark: "/networkLogos/gnosis.svg",
  },
  "https://ftmscan.com": {
    light: "/explorerLogos/ftmscan.svg",
    dark: "/networkLogos/fantom.svg",
  },
  "https://arbiscan.io": {
    light: "/networkLogos/arbitrum.svg",
    dark: "/networkLogos/arbitrum.svg",
  },
  "https://explorer.celo.org": {
    light: "/networkLogos/celo.svg",
    dark: "/networkLogos/celo.svg",
  },
  "https://explorer.harmony.one": {
    light: "/networkLogos/harmony.svg",
    dark: "/networkLogos/harmony.svg",
  },
  "https://optimistic.etherscan.io": {
    light: "/networkLogos/optimism.svg",
    dark: "/networkLogos/optimism.svg",
  },
  "https://moonriver.moonscan.io": {
    light: "/networkLogos/moonriver.svg",
    dark: "/networkLogos/moonriver.svg",
  },
  "https://andromeda-explorer.metis.io": {
    light: "/networkLogos/metis.svg",
    dark: "/explorerLogos/metis-dark.svg",
  },
  "https://cronos.org/explorer": {
    light: "/networkLogos/cronos.svg",
    dark: "/explorerLogos/cronos-dark.svg",
  },
  "https://blockexplorer.boba.network": {
    light: "/explorerLogos/boba-light.svg",
    dark: "/networkLogos/boba.svg",
  },
  "https://explorer.palm.io": {
    light: "/networkLogos/palm.png",
    dark: "/networkLogos/palm.png",
  },
  "https://rinkeby.etherscan.io": {
    light: "/explorerLogos/etherscan-light.svg",
    dark: "/explorerLogos/etherscan-dark.svg",
  },
  "https://goerli.etherscan.io": {
    light: "/explorerLogos/etherscan-light.svg",
    dark: "/explorerLogos/etherscan-dark.svg",
  },
}

const [metaMask, metaMaskHooks] = initializeMetaMaskConnector()
const [walletConnect, walletConnectHooks] = initializeWalletConnectConnector()
const [coinbaseWallet, coinbaseWalletHooks] = initializeCoinbaseWalletConnector()

const connectors: [MetaMask | WalletConnect | CoinbaseWallet, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
]

export { supportedChains, Chains, RPC, RPC_URLS, blockExplorerIcons, connectors }
