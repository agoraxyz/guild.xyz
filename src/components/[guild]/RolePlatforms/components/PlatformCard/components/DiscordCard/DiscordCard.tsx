import useServerData from "hooks/useServerData"
import { PropsWithChildren } from "react"
import { Platform, Rest } from "types"
import PlatformCard from "../../PlatformCard"
import DiscordCardMenu from "./components/DiscordCardMenu"

type Props = {
  guildPlatform: Platform
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
} & Rest

const DiscordCard = ({
  guildPlatform,
  actionRow,
  cornerButton,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const serverData = useServerData(guildPlatform.platformGuildId)

  return (
    <PlatformCard
      type="DISCORD"
      imageUrl={serverData?.data?.serverIcon || "/default_discord_icon.png"}
      name={serverData?.data?.serverName || ""}
      actionRow={actionRow}
      cornerButton={
        cornerButton ?? (
          <DiscordCardMenu discordServerId={guildPlatform.platformGuildId} />
        )
      }
      {...rest}
    >
      {children}
    </PlatformCard>
  )
}

export default DiscordCard
