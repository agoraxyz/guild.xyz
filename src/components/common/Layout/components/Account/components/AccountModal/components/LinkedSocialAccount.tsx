import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  AvatarBadge,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import useUser from "components/[guild]/hooks/useUser"
import useToast from "hooks/useToast"
import { DiscordLogo, LinkBreak, TelegramLogo } from "phosphor-react"
import { useRef } from "react"
import { PlatformName, User } from "types"
import useDisconnect from "../hooks/useDisconnect"

type Props = {
  name: string
  image?: string
  type: PlatformName
}

const platformData = {
  TELEGRAM: {
    icon: TelegramLogo,
    name: "Telegram",
    color: "TELEGRAM.500",
    paramName: "telegramId",
  },
  DISCORD: {
    icon: DiscordLogo,
    name: "Discord",
    color: "DISCORD.500",
    paramName: "discordId",
  },
}

const LinkedSocialAccount = ({ name, image, type }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { mutate } = useUser()
  const onSuccess = () => {
    toast({
      title: `Account removed!`,
      status: "success",
    })
    mutate(
      (prevData) =>
        ({
          ...prevData,
          platformUsers: prevData.platformUsers?.filter(
            ({ platformName }) => platformName !== type
          ),
        } as User),
      false
    )
    onClose()
  }
  const { onSubmit, isLoading, signLoadingText } = useDisconnect(onSuccess)
  const alertCancelRef = useRef()

  const circleBorderColor = useColorModeValue("gray.100", "gray.800")

  const disconnectAccount = () => onSubmit({ platformName: type })

  return (
    <>
      <HStack spacing={4} alignItems="center" w="full">
        <Avatar src={image} size="sm">
          <AvatarBadge
            boxSize={5}
            bgColor={platformData[type]?.color}
            borderWidth={1}
            borderColor={circleBorderColor}
          >
            <Icon as={platformData[type]?.icon} boxSize={3} color="white" />
          </AvatarBadge>
        </Avatar>
        <Text fontWeight="semibold">{name}</Text>
        <Tooltip label="Disconnect account" placement="top" hasArrow>
          <IconButton
            rounded="full"
            variant="ghost"
            size="sm"
            icon={<Icon as={LinkBreak} />}
            colorScheme="red"
            ml="auto !important"
            onClick={onOpen}
            aria-label="Disconnect account"
          />
        </Tooltip>
      </HStack>

      <Alert {...{ isOpen, onClose }} leastDestructiveRef={alertCancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{`Disconnect ${platformData[type]?.name} account`}</AlertDialogHeader>

            <AlertDialogBody>
              {`Are you sure? This account will lose every Guild gated access on ${platformData[type]?.name}.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={alertCancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={disconnectAccount}
                isLoading={isLoading}
                loadingText={signLoadingText || "Removing"}
                ml={3}
              >
                Disconnect
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </>
  )
}

export default LinkedSocialAccount
