import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import {
  deleteKeyPairFromIdb,
  getKeyPairFromIdb,
  setKeyPairToIdb,
} from "hooks/useKeyPair"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import { mutate } from "swr"
import { PlatformName, User } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"

type PlatformResult = {
  platformId: number
  platformName: PlatformName
} & (
  | { success: true }
  | {
      success: false
      errorMsg: "Unknown Member"
      invite: string
    }
)

type Response = {
  success: boolean
  platformResults: PlatformResult[]
}

export type JoinPlatformData =
  | {
      authData: any
    }
  | {
      hash: string
    }

const useJoinPlatform = (
  platform: PlatformName | "",
  joinPlatformData?: JoinPlatformData
) => {
  const { account } = useWeb3React()
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const guild = useGuild()
  const user = useUser()
  const fetcherWithSign = useFetcherWithSign()

  const submit = ({
    data,
    validation,
  }: WithValidation<unknown>): Promise<Response> =>
    fetcher(`/user/join`, {
      body: data,
      validation,
    }).then((body) => {
      if (body === "rejected") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw "Something went wrong, join request rejected."
      }

      if (typeof body === "string") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw body
      }

      return body
    })

  const useSubmitResponse = useSubmitWithSign<any, Response>(submit, {
    // Revalidating the address list in the AccountModal component
    onSuccess: () => {
      addDatadogAction(`Successfully joined a guild`)
      if (platform?.length > 0)
        addDatadogAction(`Successfully joined a guild [${platform}]`)
      ;(async () => {
        const [prevKeys, newUser] = await Promise.all([
          getKeyPairFromIdb(user?.id),
          fetcherWithSign(`/user/details/${account}`, {
            method: "POST",
            body: {},
          }) as Promise<User>,
        ])

        if (user?.id === newUser?.id || !prevKeys) return

        await setKeyPairToIdb(newUser?.id, prevKeys)
        await mutate([`/user/details/${account}`, { method: "POST", body: {} }])
        await deleteKeyPairFromIdb(user?.id)
      })()
    },
    onError: (err) => {
      addDatadogError(`Guild join error`, { error: err }, "custom")
      if (platform?.length > 0)
        addDatadogError(`Guild join error [${platform}]`, { error: err }, "custom")
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: () =>
      useSubmitResponse.onSubmit({
        guildId: guild?.id,
        platforms: !!joinPlatformData
          ? platform === ""
            ? []
            : [
                {
                  name: platform,
                  ...joinPlatformData,
                },
              ]
          : undefined,
      }),
  }
}

export default useJoinPlatform
