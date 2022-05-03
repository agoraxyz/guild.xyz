import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { CreateGuildParams, CreateGuildResponse, guild } from "@guildxyz/sdk"
import { useWeb3React } from "@web3-react/core"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import { useSigningManager } from "components/_app/SigningManager"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { GuildFormType } from "types"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

const useCreateGuild = () => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()
  const matchMutate = useMatchMutate()

  const { account } = useWeb3React()
  const { sign } = useSigningManager()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()

  const fetchData = async (data: CreateGuildParams) =>
    guild.create(account, sign, data)

  const useSubmitResponse = useSubmit<CreateGuildParams, CreateGuildResponse>(
    fetchData,
    {
      onError: (error_) => {
        addDatadogError(`Guild creation error`, { error: error_ }, "custom")
        showErrorToast(error_)
      },
      onSuccess: (response_) => {
        addDatadogAction(`Successful guild creation`)
        triggerConfetti()

        toast({
          title: `Guild successfully created!`,
          description: "You're being redirected to it's page",
          status: "success",
        })
        router.push(`/${response_.urlName}`)

        matchMutate(/^\/guild\/address\//)
        matchMutate(/^\/guild\?order/)
      },
    }
  )

  return {
    ...useSubmitResponse,
    onSubmit: (data_: GuildFormType) => {
      const data = {
        ...data_,
        // Handling TG group ID with and without "-"
        platformId: data_[data_.platform]?.platformId,
        roles: [
          {
            imageUrl: data_.imageUrl,
            name: "Member",
            requirements: preprocessRequirements(data_?.requirements),
          },
        ],
      }

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useCreateGuild
