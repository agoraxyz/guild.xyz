import Button from "components/common/Button"
import useDCAuthWithCallback from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuthWithCallback"
import dynamic from "next/dynamic"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useMemo } from "react"
import { PlatformName } from "types"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const DiscordSelectButton = ({ onSelection }: Props) => {
  const { callbackWithDCAuth, isAuthenticating, authorization } =
    useDCAuthWithCallback("guilds", () => onSelection("DISCORD"))

  const DynamicCtaIcon = useMemo(
    () => dynamic(async () => (!authorization ? ArrowSquareIn : CaretRight)),
    [authorization]
  )

  return (
    <Button
      onClick={callbackWithDCAuth}
      isLoading={isAuthenticating}
      colorScheme="DISCORD"
      loadingText={"Check the popup window"}
      rightIcon={<DynamicCtaIcon />}
    >
      Select server
    </Button>
  )
}

export default DiscordSelectButton
