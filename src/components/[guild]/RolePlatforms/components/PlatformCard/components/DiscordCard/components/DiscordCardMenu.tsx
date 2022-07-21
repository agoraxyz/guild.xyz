import {
  IconButton,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import CreatePoap from "components/[guild]/CreatePoap"
import useGuild from "components/[guild]/hooks/useGuild"
import { DotsThree } from "phosphor-react"
import { PlatformType } from "types"

type Props = {
  discordServerId: string
}

const DiscordCardMenu = ({ discordServerId }: Props): JSX.Element => {
  const {
    isOpen: isCreatePoapOpen,
    onOpen: onCreatePoapOpen,
    onClose: onCreatePoapClose,
  } = useDisclosure()

  const { guildPlatforms, poaps } = useGuild()

  return (
    <>
      <Menu placement="bottom-end">
        <MenuButton
          as={IconButton}
          icon={<DotsThree />}
          aria-label="Menu"
          boxSize={8}
          minW={8}
          rounded="full"
          colorScheme="alpha"
          data-dd-action-name="Discord card menu"
        />

        <MenuList>
          {guildPlatforms?.some((p) => p.platformId === PlatformType.DISCORD) && (
            <MenuItem
              icon={
                <Img
                  boxSize={3}
                  src="/requirementLogos/poap.svg"
                  alt="Drop POAP icon"
                />
              }
              onClick={onCreatePoapOpen}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text as="span">{poaps?.length ? "Manage POAPs" : "Drop POAP"}</Text>
                <Tag fontSize="x-small" fontWeight="semibold" h={5} minH={0}>
                  Alpha
                </Tag>
              </Stack>
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <CreatePoap
        {...{
          isOpen: isCreatePoapOpen,
          onOpen: onCreatePoapOpen,
          onClose: onCreatePoapClose,
          discordServerId,
        }}
      />
    </>
  )
}

export default DiscordCardMenu
