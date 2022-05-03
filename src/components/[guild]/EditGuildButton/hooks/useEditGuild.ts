import { guild, UpdateGuildParams } from "@guildxyz/sdk"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { useSigningManager } from "components/_app/SigningManager"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"
import replacer from "utils/guildJsonReplacer"

type Props = {
  onSuccess?: () => void
  guildId?: number
}

const useEditGuild = ({ onSuccess, guildId }: Props = {}) => {
  const { account } = useWeb3React()
  const { sign } = useSigningManager()

  const guildData = useGuild(guildId)

  const { mutate } = useSWRConfig()
  const matchMutate = useMatchMutate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()

  const id = guildId ?? guildData?.id

  const submit = async (data: UpdateGuildParams) =>
    guild.update(id, account, sign, data)

  const useSubmitResponse = useSubmit<UpdateGuildParams, any>(submit, {
    onSuccess: (newGuild) => {
      toast({
        title: `Guild successfully updated!`,
        status: "success",
      })
      if (onSuccess) onSuccess()
      mutate([`/guild/${guildData?.urlName}`, undefined])

      matchMutate(/^\/guild\/address\//)
      matchMutate(/^\/guild\?order/)
      if (newGuild?.urlName && newGuild.urlName !== guildData?.urlName) {
        router.push(newGuild.urlName)
      }
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) => {
      if (
        !!data.isGuarded &&
        !guildData.roles.some((role) =>
          role.requirements.some((requirement) => requirement.type === "FREE")
        )
      ) {
        data.roles = [
          {
            guildId: guildData.id,
            ...(guildData.platforms?.[0]
              ? {
                  platform: guildData.platforms[0].type,
                  platformId: guildData.platforms[0].platformId,
                }
              : {}),
            name: "Verified",
            description: "",
            logic: "AND",
            requirements: [{ type: "FREE" }],
            imageUrl: "/guildLogos/0.svg",
          },
        ]
      }
      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useEditGuild
