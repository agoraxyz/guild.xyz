import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import { Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessGatedChannels from "utils/preprocessGatedChannels"
import preprocessRequirements from "utils/preprocessRequirements"

const useEditRole = (roleId: number, onSuccess?: () => void) => {
  const guild = useGuild()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = ({ validation, data }: WithValidation<Role>) =>
    fetcher(`/role/${roleId}`, {
      method: "PATCH",
      body: data,
      validation,
    })

  const useSubmitResponse = useSubmitWithSign<Role, any>(submit, {
    onSuccess: () => {
      toast({
        title: `Role successfully updated!`,
        status: "success",
      })
      if (onSuccess) onSuccess()
      mutate([`/guild/details/${guild?.urlName}`, { method: "POST", body: {} }])
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) => {
      data.requirements = preprocessRequirements(data?.requirements)
      if (!!data.rolePlatforms?.[0]?.platformRoleData) {
        data.rolePlatforms[0].platformRoleData.gatedChannels =
          preprocessGatedChannels(
            data.rolePlatforms?.[0]?.platformRoleData?.gatedChannels
          )
      }

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useEditRole
