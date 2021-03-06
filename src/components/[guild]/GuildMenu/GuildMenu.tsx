import {
  Icon,
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
import OnboardingMarker from "components/common/OnboardingMarker"
import { DotsThree, GearSix } from "phosphor-react"
import { PlatformType } from "types"
import CreatePoap from "../CreatePoap"
import EditGuild from "../EditGuild"
import useGuild from "../hooks/useGuild"
import { useOnboardingContext } from "../Onboarding/components/OnboardingProvider"

const GuildMenu = (): JSX.Element => {
  const {
    isOpen: isEditGuildOpen,
    onOpen: onEditGuildOpen,
    onClose: onEditGuildClose,
  } = useDisclosure()

  const {
    isOpen: isCreatePoapOpen,
    onOpen: onCreatePoapOpen,
    onClose: onCreatePoapClose,
  } = useDisclosure()

  const { localStep } = useOnboardingContext()

  const { guildPlatforms, poaps } = useGuild()

  return (
    <>
      <Menu placement="bottom-end">
        <OnboardingMarker step={1}>
          <MenuButton
            as={IconButton}
            icon={<DotsThree />}
            aria-label="Menu"
            minW={"44px"}
            rounded="full"
            colorScheme="alpha"
            data-dd-action-name={
              localStep === null ? "Edit guild" : "Edit guild [onboarding]"
            }
          />
        </OnboardingMarker>

        <MenuList>
          <MenuItem icon={<Icon as={GearSix} />} onClick={onEditGuildOpen}>
            Edit guild
          </MenuItem>
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

      <EditGuild
        {...{
          isOpen: isEditGuildOpen,
          onOpen: onEditGuildOpen,
          onClose: onEditGuildClose,
        }}
      />

      <CreatePoap
        {...{
          isOpen: isCreatePoapOpen,
          onOpen: onCreatePoapOpen,
          onClose: onCreatePoapClose,
        }}
      />
    </>
  )
}

export default GuildMenu
