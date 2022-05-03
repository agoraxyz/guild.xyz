import { Text, ToastId, useColorModeValue } from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { CreateRoleParams, CreateRoleResponse, role } from "@guildxyz/sdk"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import { useSigningManager } from "components/_app/SigningManager"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { TwitterLogo } from "phosphor-react"
import { useRef } from "react"
import { unstable_serialize, useSWRConfig } from "swr"
import { GuildFormType } from "types"
import replacer from "utils/guildJsonReplacer"
import preprocessGatedChannels from "utils/preprocessGatedChannels"
import preprocessRequirements from "utils/preprocessRequirements"

const useCreateRole = () => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()
  const toastIdRef = useRef<ToastId>()
  const { account } = useWeb3React()
  const { sign } = useSigningManager()

  const { mutate } = useSWRConfig()
  const matchMutate = useMatchMutate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()
  const tweetButtonBackground = useColorModeValue("blackAlpha.100", undefined)

  const fetchData = async (data: CreateRoleParams) =>
    role.create(account, sign, data)

  const useSubmitResponse = useSubmit<CreateRoleParams, CreateRoleResponse>(
    fetchData,
    {
      onError: (error_) => {
        addDatadogError(`Role creation error`, { error: error_ }, "custom")
        showErrorToast(error_)
      },
      onSuccess: (response_) => {
        if (router.query.guildId) {
          addDatadogAction(`Successful role creation`)
          triggerConfetti()

          toastIdRef.current = toast({
            duration: 8000,
            title: "Role successfully created",
            description: (
              <>
                <Text>Let your guild know by sharing it on Twitter</Text>
                <Button
                  as="a"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I've just added a new role to my guild. Check it out, maybe you have access 😉
guild.xyz/${router.query.guild} @guildxyz`)}`}
                  target="_blank"
                  bg={tweetButtonBackground}
                  leftIcon={<TwitterLogo weight="fill" />}
                  size="sm"
                  onClick={() => toast.close(toastIdRef.current)}
                  mt={3}
                  mb="1"
                  borderRadius="lg"
                >
                  Share
                </Button>
              </>
            ),
            status: "success",
          })
        }

        // TODO: add `guildId` attribute to the CreateRoleResponse type in the Guild SDK & remove casting to any
        mutate(
          unstable_serialize([
            `/guild/${router.query.guild ?? (response_ as any).guildId}`,
            undefined,
          ])
        )
        mutate(`/guild/access/${(response_ as any).guildId}/${account}`)

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
        // Mapping requirements in order to properly send "interval-like" NFT attribute values to the API
        requirements: preprocessRequirements(data_?.requirements || []),
        gatedChannels: preprocessGatedChannels(data_?.gatedChannels),
      }

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useCreateRole
