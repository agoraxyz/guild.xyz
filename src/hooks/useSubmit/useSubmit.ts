import { hexStripZeros } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/keccak256"
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import { randomBytes } from "crypto"
import stringify from "fast-json-stable-stringify"
import useKeyPair from "hooks/useKeyPair"
import { useState } from "react"
import useSWR from "swr"
import { ValidationMethod } from "types"
import { bufferToHex, strToBuffer } from "utils/bufferUtils"
import fetcher from "utils/fetcher"
import gnosisSafeSignCallback from "./utils/gnosisSafeSignCallback"

type Options<ResponseType> = {
  onSuccess?: (response: ResponseType) => void
  onError?: (error: any) => void
}

const useSubmit = <DataType, ResponseType>(
  fetch: (data?: DataType) => Promise<ResponseType>,
  { onSuccess, onError }: Options<ResponseType> = {}
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(undefined)
  const [response, setResponse] = useState<ResponseType>(undefined)

  return {
    onSubmit: (data?: DataType) => {
      setIsLoading(true)
      setError(undefined)
      fetch(data)
        .then((d) => {
          onSuccess?.(d)
          setResponse(d)
        })
        .catch((e) => {
          onError?.(e)
          setError(e)
        })
        .finally(() => setIsLoading(false))
    },
    response,
    isLoading,
    error,
  }
}

export type ValidationData = {
  address: string
  library: Web3Provider
}

export type WithValidation<D> = { data: D; validation: ValidationData }

export type Validation = {
  params: {
    method: ValidationMethod
    addr: string
    nonce: string
    hash?: string
    msg: string
    chainId: string
    ts: string
  }
  sig: string
}

const DEFAULT_MESSAGE = "Please sign this message"

const signCallbacks = [
  {
    nameRegex: /Gnosis Safe Multisig/i,
    signCallback: gnosisSafeSignCallback,
    loadingText: "Safe transaction in progress",
  },
]

const getMessage = ({
  msg,
  addr,
  method,
  chainId,
  hash,
  nonce,
  ts,
}: {
  msg: string
  addr: string
  method: ValidationMethod
  chainId: string
  hash?: string
  nonce: string
  ts: string
}) =>
  `${msg}\n\nAddress: ${addr}\nMethod: ${method}${
    chainId ? `\nChainId: ${chainId}` : ""
  }${hash ? `\nHash: ${hash}` : ""}\nNonce: ${nonce}\nTimestamp: ${ts}`

const DEFAULT_SIGN_LOADING_TEXT = "Check your wallet"

const useSubmitWithSignWithParamKeyPair = <DataType, ResponseType>(
  fetch: ({ data: DataType, validation: Validation }) => Promise<ResponseType>,
  {
    message = DEFAULT_MESSAGE,
    forcePrompt = false,
    keyPair,
    ...options
  }: Options<ResponseType> & {
    message?: string
    forcePrompt?: boolean
    keyPair: CryptoKeyPair
  } = {
    message: DEFAULT_MESSAGE,
    forcePrompt: false,
    keyPair: undefined,
  }
) => {
  const { account, provider, chainId } = useWeb3React()
  const { data: peerMeta } = useSWR<any>(
    typeof window !== "undefined" ? "walletConnectPeerMeta" : null,
    () => JSON.parse(window.localStorage.getItem("walletconnect")).peerMeta,
    { refreshInterval: 200, revalidateOnMount: true }
  )

  const defaultLoadingText =
    forcePrompt || !keyPair ? DEFAULT_SIGN_LOADING_TEXT : undefined

  const [isSigning, setIsSigning] = useState<boolean>(false)
  const [signLoadingText, setSignLoadingText] = useState<string>(defaultLoadingText)

  const useSubmitResponse = useSubmit<DataType, ResponseType>(
    async (data: DataType | Record<string, unknown> = {}) => {
      setIsSigning(true)
      const validation = await sign({
        provider,
        address: account,
        payload: data ?? {},
        chainId: chainId.toString(),
        forcePrompt,
        keyPair,
        msg: message,
      })
        .catch((error) => {
          console.error(error)
          throw error
        })
        .then(async (val) => {
          const callbackData = signCallbacks.find(({ nameRegex }) =>
            nameRegex.test(peerMeta?.name)
          )
          if ((forcePrompt || !keyPair) && callbackData) {
            setSignLoadingText(callbackData.loadingText || defaultLoadingText)
            const msg = getMessage(val.params)
            await callbackData
              .signCallback(msg, account, chainId)
              .finally(() => setSignLoadingText(defaultLoadingText))
          }
          return val
        })
        .finally(() => setIsSigning(false))

      return fetch({ data: data as DataType, validation })
    },
    options
  )

  return {
    ...useSubmitResponse,
    isSigning,
    signLoadingText: isSigning ? signLoadingText : null,
  }
}

const useSubmitWithSign = <DataType, ResponseType>(
  fetch: ({ data: DataType, validation: Validation }) => Promise<ResponseType>,
  {
    message = DEFAULT_MESSAGE,
    forcePrompt = false,
    ...options
  }: Options<ResponseType> & {
    message?: string
    forcePrompt?: boolean
  } = {
    message: DEFAULT_MESSAGE,
    forcePrompt: false,
  }
) => {
  const { keyPair } = useKeyPair()
  return useSubmitWithSignWithParamKeyPair(fetch, {
    message,
    forcePrompt,
    ...options,
    keyPair,
  })
}

export type SignProps = {
  provider: Web3Provider
  address: string
  payload: any
  chainId: string
  forcePrompt: boolean
  keyPair?: CryptoKeyPair
  msg?: string
}

const sign = async ({
  provider,
  address,
  payload,
  chainId: paramChainId,
  keyPair,
  forcePrompt,
  msg = DEFAULT_MESSAGE,
}: SignProps): Promise<Validation> => {
  const rpcProvider = new JsonRpcProvider(RPC[Chains[paramChainId]].rpcUrls[0])
  const bytecode = await rpcProvider.getCode(address)

  const shouldUseKeyPair = !!keyPair && !forcePrompt

  const isSmartContract = bytecode && hexStripZeros(bytecode) !== "0x"

  const method = shouldUseKeyPair
    ? ValidationMethod.KEYPAIR
    : isSmartContract
    ? ValidationMethod.EIP1271
    : ValidationMethod.STANDARD

  const addr = address.toLowerCase()
  const nonce = randomBytes(32).toString("base64")

  const payloadToSign = { ...payload }
  delete payloadToSign?.keyPair
  const hash =
    Object.keys(payloadToSign).length > 0
      ? keccak256(toUtf8Bytes(stringify(payloadToSign)))
      : undefined
  const ts = await fetcher("/api/timestamp").catch(() => Date.now().toString())

  const chainId = method === ValidationMethod.EIP1271 ? paramChainId : undefined

  const message = getMessage({ msg, addr, method, chainId, hash, nonce, ts })

  const sig = await (method === ValidationMethod.KEYPAIR
    ? window.crypto.subtle
        .sign(
          { name: "ECDSA", hash: "SHA-512" },
          keyPair.privateKey,
          strToBuffer(message)
        )
        .then((signatureBuffer) => bufferToHex(signatureBuffer))
    : provider.getSigner(address.toLowerCase()).signMessage(message))

  return { params: { chainId, msg, method, addr, nonce, hash, ts }, sig }
}

export default useSubmit
export { useSubmitWithSignWithParamKeyPair, sign, useSubmitWithSign }
