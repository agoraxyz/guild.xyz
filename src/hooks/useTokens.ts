import { Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import { CoingeckoToken } from "types"
import fetcher from "utils/fetcher"

const TokenApiURLs = {
  ETHEREUM: ["https://tokens.coingecko.com/uniswap/all.json"],
  BSC: ["https://tokens.pancakeswap.finance/pancakeswap-extended.json"],
  GNOSIS: [
    "https://unpkg.com/@1hive/default-token-list@5.17.1/build/honeyswap-default.tokenlist.json",
  ],
  POLYGON: [
    "https://unpkg.com/quickswap-default-token-list@1.0.91/build/quickswap-default.tokenlist.json",
  ],
  AVALANCHE: [
    "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/joe.tokenlist.json",
  ],
  FANTOM: [
    "https://raw.githubusercontent.com/Crocoswap/tokenlists/main/aeb.tokenlist.json",
  ],
  ARBITRUM: ["https://bridge.arbitrum.io/token-list-42161.json"],
  CELO: [
    "https://raw.githubusercontent.com/Ubeswap/default-token-list/master/ubeswap.token-list.json",
  ],
  HARMONY: [
    "https://raw.githubusercontent.com/DefiKingdoms/community-token-list/main/src/defikingdoms-default.tokenlist.json",
    "https://raw.githubusercontent.com/DefiKingdoms/community-token-list/main/build/defikingdoms-community.tokenlist.json",
  ],
  GOERLI: [
    "https://raw.githubusercontent.com/Uniswap/default-token-list/main/src/tokens/goerli.json",
  ],
  OPTIMISM: ["https://static.optimism.io/optimism.tokenlist.json"],
  MOONBEAM: ["https://tokens.coingecko.com/moonbeam/all.json"],
  MOONRIVER: ["https://tokens.coingecko.com/moonriver/all.json"],
  RINKEBY: [
    "https://raw.githubusercontent.com/Uniswap/default-token-list/main/src/tokens/rinkeby.json",
  ],
  METIS: ["https://tokens.coingecko.com/metis-andromeda/all.json"],
  CRONOS: ["https://tokens.coingecko.com/cronos/all.json"],
  BOBA: ["https://tokens.coingecko.com/boba/all.json"],
  PALM: [],
}

const fetchTokens = async (_: string, chain: string) =>
  Promise.all(TokenApiURLs[chain].map((url) => fetcher(url))).then(
    (tokenArrays: any) => {
      const finalTokenArray = tokenArrays.reduce(
        (acc, curr) =>
          acc.concat(
            (Array.isArray(curr) ? curr : curr?.tokens)?.filter(
              ({ chainId }) => chainId === Chains[chain]
            )
          ),
        []
      )
      return RPC[chain]
        ? [RPC[chain].nativeCurrency].concat(finalTokenArray)
        : finalTokenArray
    }
  )

const useTokens = (chain: string) => {
  const { isValidating, data } = useSWRImmutable<Array<CoingeckoToken>>(
    chain ? ["tokens", chain] : null,
    fetchTokens
  )

  return { tokens: data, isLoading: isValidating }
}

export default useTokens
