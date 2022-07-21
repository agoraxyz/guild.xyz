import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useFieldArray } from "react-hook-form"
import { useSWRConfig } from "swr"
import { useRolePlatform } from "../../RolePlatformProvider"

type Data = {
  removePlatformAccess?: number
}

// temporary version until there's no delete rolePlatform endpoint
const useRemovePlatform = () => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { index } = useRolePlatform()
  const { remove } = useFieldArray({
    name: "rolePlatforms",
  })

  const guild = useGuild()

  // const submit = async ({ validation, data }: WithValidation<Data>) =>
  //   fetcher(`/role/${roleId}`, {
  //     method: "DELETE",
  //     body: data,
  //     validation,
  //   })

  const submit = async (data: Data) => console.log(data)

  // return useSubmitWithSign<Data, any>(submit, {
  return useSubmit<Data, any>(submit, {
    onSuccess: () => {
      // toast({
      //   title: `Platform removed!`,
      //   status: "success",
      // })
      remove(index)

      // mutate([`/guild/${guild?.urlName}`, undefined])
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useRemovePlatform
