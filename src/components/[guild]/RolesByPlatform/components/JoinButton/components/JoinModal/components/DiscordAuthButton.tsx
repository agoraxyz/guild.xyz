import ModalButton from "components/common/ModalButton"
import useUser from "components/[guild]/hooks/useUser"
import { useRouter } from "next/router"
import { Check, DiscordLogo } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import useDCAuth from "../hooks/useDCAuth"

const DiscordAuthButton = (): JSX.Element => {
  const user = useUser()
  const router = useRouter()

  const discordFromDb = user?.platformUsers?.some(
    (platformUser) => platformUser.platformName === "DISCORD"
  )
  const discordFromQueryParam =
    router.query.platform === "DISCORD" && typeof router.query.hash === "string"

  const { onOpen, authorization, error, isAuthenticating } = useDCAuth("identify")
  // const {
  //   response: dcUserId,
  //   isLoading: isFetchingUserId,
  //   onSubmit: fetchUserId,
  //   error: dcUserIdError,
  // } = useSubmit(() =>
  //   fetcherWithDCAuth(authorization, "https://discord.com/api/users/@me").then(
  //     (res) => res.id
  //   )
  // )
  // useEffect(() => {
  //   if (authorization?.length > 0) fetchUserId()
  // }, [authorization])

  const { setValue } = useFormContext()

  useEffect(() => {
    if (discordFromDb) return

    if (discordFromQueryParam)
      setValue("platforms.DISCORD", { hash: router.query.hash as string })

    if (authorization)
      setValue("platforms.DISCORD", {
        authData: { access_token: authorization?.split(" ")?.[1] },
      })
  }, [discordFromDb, discordFromQueryParam, authorization])

  if (discordFromDb || discordFromQueryParam || authorization)
    return (
      <ModalButton
        as="div"
        colorScheme="gray"
        variant="solidStatic"
        rightIcon={<DiscordLogo />}
        leftIcon={<Check />}
        justifyContent="space-between"
        px="4"
      >
        Discord connected
      </ModalButton>
    )

  return (
    <ModalButton
      onClick={onOpen}
      colorScheme="DISCORD"
      isLoading={isAuthenticating}
      loadingText={isAuthenticating && "Confirm in the pop-up"}
    >
      Connect Discord
    </ModalButton>
  )
}

export default DiscordAuthButton
