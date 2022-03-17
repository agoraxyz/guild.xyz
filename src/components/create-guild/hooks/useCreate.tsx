import { Button, HStack, Text, ToastId } from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import Link from "components/common/Link"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { TwitterLogo } from "phosphor-react"
import { useRef } from "react"
import { useSWRConfig } from "swr"
import { Guild, PlatformName, Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

type FormInputs = {
  platform?: PlatformName
  DISCORD?: { platformId?: string }
  TELEGRAM?: { platformId?: string }
  channelId?: string
}
type RoleOrGuild = Role & Guild & FormInputs & { sign?: boolean }

const useCreate = () => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()
  const toastIdRef = useRef<ToastId>()

  const { mutate } = useSWRConfig()
  const matchMutate = useMatchMutate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()

  const fetchData = async ({
    validation,
    data,
  }: WithValidation<RoleOrGuild>): Promise<RoleOrGuild> =>
    fetcher(router.query.guild ? "/role" : "/guild", {
      validation,
      body: data,
    })

  const useSubmitResponse = useSubmitWithSign<any, RoleOrGuild>(fetchData, {
    onError: (error_) => {
      addDatadogError(
        `${router.query.guild ? "Role" : "Guild"} creation error`,
        { error: error_ },
        "custom"
      )
      showErrorToast(error_)
    },
    onSuccess: (response_) => {
      addDatadogAction(
        `Successful ${router.query.guild ? "role" : "guild"} creation`
      )
      triggerConfetti()
      if (router.query.guild) {
        toastIdRef.current = toast({
          duration: 8000,
          title:
            "Congratulations, your new role is successfully added to your guild!",
          description: (
            <>
              <Text>Let your guild know by sharing it with them on Twitter.</Text>
              <HStack justifyContent="end" mt={2}>
                <Link
                  href={`https://twitter.com/intent/tweet?text=Hey%2C%20I%20just%20added%20a%20new%20role%20to%20my%20guild.%20Check%20it%20out%2C%20maybe%20you%20have%20access%20%F0%9F%98%89%0Ahttps%3A%2F%2Fguild.xyz%2F${router.query.guild}`}
                  target="_blank"
                  _hover={{ textDecoration: "none" }}
                >
                  <Button
                    leftIcon={<TwitterLogo weight="fill" />}
                    colorScheme="twitter"
                    size="sm"
                    onClick={() => toast.close(toastIdRef.current)}
                  >
                    Share
                  </Button>
                </Link>
              </HStack>
            </>
          ),
          status: "success",
        })
        mutate(`/guild/${router.query.guild}`)
      } else {
        toast({
          title: `Guild successfully created!`,
          description: "You're being redirected to it's page",
          status: "success",
        })
        router.push(`/${response_.urlName}`)
      }

      matchMutate(/^\/guild\/address\//)
      matchMutate(/^\/guild\?order/)
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data_) => {
      const data = router.query.guild
        ? {
            ...data_,
            // Mapping requirements in order to properly send "interval-like" NFT attribute values to the API
            requirements: preprocessRequirements(data_?.requirements || []),
          }
        : {
            imageUrl: data_.imageUrl,
            name: data_.name,
            urlName: data_.urlName,
            description: data_.description,
            platform: data_.platform,
            // Handling TG group ID with and without "-"
            platformId: data_[data_.platform]?.platformId,
            channelId: data_.channelId,
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

export default useCreate