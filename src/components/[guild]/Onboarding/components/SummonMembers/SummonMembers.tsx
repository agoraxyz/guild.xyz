import { Tag, TagLeftIcon, Text, useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { Check } from "phosphor-react"
import { PlatformType } from "types"
import PaginationButtons from "../PaginationButtons"
import SendDiscordJoinButtonModal from "./components/SendDiscordJoinButtonModal"

type Props = {
  activeStep: number
  prevStep: () => void
  nextStep: () => void
}

export type SummonMembersForm = {
  channelId: string
  serverId: string
  title: string
  description: string
  button: string
}

const SummonMembers = ({ activeStep, prevStep, nextStep }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { guildPlatforms } = useGuild()

  const discordPlatform = guildPlatforms?.find(
    (p) => p.platformId === PlatformType.DISCORD
  )
  const hasJoinButton = discordPlatform.platformGuildData?.joinButton !== false

  return (
    <>
      {hasJoinButton ? (
        <Tag colorScheme={"DISCORD"} variant="solid">
          <TagLeftIcon as={Check} />
          Join button already sent to Discord
        </Tag>
      ) : (
        <Text>
          If you're satisfied with everything, it's time to invite your community to
          join!
        </Text>
      )}
      <PaginationButtons
        activeStep={activeStep}
        prevStep={prevStep}
        nextStep={hasJoinButton ? nextStep : onOpen}
        nextLabel={hasJoinButton ? "Finish" : "Send Discord join button"}
      />
      <SendDiscordJoinButtonModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={nextStep}
        serverId={discordPlatform.platformGuildId}
      />
    </>
  )
}

export default SummonMembers
