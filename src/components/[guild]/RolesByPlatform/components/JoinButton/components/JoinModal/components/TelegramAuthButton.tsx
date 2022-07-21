import ModalButton from "components/common/ModalButton"
import useUser from "components/[guild]/hooks/useUser"
import Script from "next/script"
import { Check, TelegramLogo } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import useTGAuth from "../hooks/useTGAuth"

const TelegramAuthButton = (): JSX.Element => {
  const { platformUsers } = useUser()

  const telegramFromDb = !!platformUsers?.some(
    (platform) => platform?.platformName === "TELEGRAM"
  )

  const { onOpen, telegramId, isAuthenticating, authData } = useTGAuth()

  const { setValue } = useFormContext()

  useEffect(() => {
    if (telegramFromDb) return

    if (authData) setValue("platforms.TELEGRAM", { authData })
  }, [authData, telegramFromDb])

  if (telegramFromDb || telegramId?.length > 0)
    return (
      <ModalButton
        mb="3"
        as="div"
        colorScheme="gray"
        variant="solidStatic"
        rightIcon={<TelegramLogo />}
        leftIcon={<Check />}
        justifyContent="space-between"
        px="4"
      >
        Telegram connected
      </ModalButton>
    )

  return (
    <>
      <Script
        strategy="lazyOnload"
        src="https://telegram.org/js/telegram-widget.js?19"
      />
      <ModalButton
        onClick={onOpen}
        colorScheme="TELEGRAM"
        isLoading={isAuthenticating}
        loadingText={isAuthenticating && "Authenticate in the pop-up"}
      >
        Connect Telegram
      </ModalButton>
    </>
  )
}

export default TelegramAuthButton
