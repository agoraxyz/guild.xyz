import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { Guild, PlatformType, Requirement } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

// TODO: better types
type RoleOrGuild = Guild & { requirements?: Array<Requirement> }

const useCreateGuild = () => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()
  const matchMutate = useMatchMutate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()

  const fetchData = async ({
    validation,
    data,
  }: WithValidation<RoleOrGuild>): Promise<RoleOrGuild> =>
    fetcher("/guild", {
      validation,
      body: data,
    })

  const useSubmitResponse = useSubmitWithSign<any, RoleOrGuild>(fetchData, {
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
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data_) => {
      const data = {
        ...data_,
        // prettier-ignore
        ...(data_.guildPlatforms?.[0]?.platformId === PlatformType.TELEGRAM && data_.requirements?.length && {
            requirements: undefined,
            roles: [
              {
                name: "Member",
                imageUrl: data_.imageUrl,
                requirements: preprocessRequirements(data_.requirements),
                rolePlatforms: [
                  {
                    guildPlatformIndex: 0,
                  },
                ],
              },
            ],
          }),
      }

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useCreateGuild
