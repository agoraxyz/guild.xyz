import { datadogRum } from "@datadog/browser-rum"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useKeyPair from "hooks/useKeyPair"
import { sign } from "hooks/useSubmit"
import { SignProps } from "hooks/useSubmit/useSubmit"

const fetcher = async (
  resource: string,
  { body, validation, ...init }: Record<string, any> = {}
) => {
  const isGuildApiCall = !resource.startsWith("http") && !resource.startsWith("/api")

  const api = isGuildApiCall ? process.env.NEXT_PUBLIC_API : ""

  const payload = body ?? {}

  const options = {
    ...(body
      ? {
          method: "POST",
          body: JSON.stringify(
            validation
              ? {
                  payload,
                  ...validation,
                }
              : body
          ),
        }
      : {}),
    ...init,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  }

  if (isGuildApiCall)
    datadogRum?.addAction("FETCH", { url: `${api}${resource}`, options })

  return fetch(`${api}${resource}`, options).then(async (response: Response) => {
    const res = await response.json?.()

    if (!res.ok && isGuildApiCall)
      datadogRum?.addError("FETCH ERROR", {
        url: `${api}${resource}`,
        response: res,
      })

    return response.ok ? res : Promise.reject(res)
  })
}

const fetcherWithSign = async (
  signProps: Omit<SignProps, "payload" | "forcePrompt"> & {
    forcePrompt?: boolean
  },
  resource: string,
  { body, ...rest }: Record<string, any> = {}
) => {
  const validation = await sign({
    forcePrompt: false,
    ...signProps,
    payload: body,
  })

  return fetcher(resource, { body, validation, ...rest })
}

const useFetcherWithSign = () => {
  const { account, chainId, provider } = useWeb3React<Web3Provider>()
  const { keyPair } = useKeyPair()

  return (resource: string, { signOptions, ...options }: Record<string, any> = {}) =>
    fetcherWithSign(
      {
        address: account,
        chainId: chainId.toString(),
        provider,
        keyPair,
        ...signOptions,
      },
      resource,
      options
    )
}

export { fetcherWithSign, useFetcherWithSign }
export default fetcher
