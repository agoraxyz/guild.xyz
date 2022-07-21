import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { PropsWithChildren } from "react"
import { Platform } from "types"
import PlatformCard from "../PlatformCard"

type Props = {
  guildPlatform: Platform
  cornerButton: JSX.Element
}

const TelegramCard = ({
  guildPlatform,
  cornerButton,
  children,
}: PropsWithChildren<Props>) => {
  const {
    data: { groupIcon, groupName },
  } = useIsTGBotIn(guildPlatform.platformGuildId)

  return (
    <PlatformCard
      type="TELEGRAM"
      imageUrl={groupIcon || "/default_telegram_icon.png"}
      name={groupName || ""}
      cornerButton={cornerButton}
    >
      {children}
    </PlatformCard>
  )
}

export default TelegramCard
