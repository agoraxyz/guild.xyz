import {
  FormControl,
  FormLabel,
  GridItem,
  Input,
  SimpleGrid,
} from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Uploader } from "hooks/usePinata/usePinata"
import { Check } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import useSetImageAndNameFromPlatformData from "../hooks/useSetImageAndNameFromPlatformData"
import useIsTGBotIn from "./hooks/useIsTGBotIn"

type Props = {
  onUpload: Uploader["onUpload"]
}

const TelegramGroup = ({ onUpload }: Props) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const platformId = useWatch({ name: "guildPlatforms.0.platformGuildId" })

  const {
    data: { ok: isIn, message: errorMessage, groupIcon, groupName },
    isLoading,
  } = useIsTGBotIn(platformId)

  useSetImageAndNameFromPlatformData(groupIcon, groupName, onUpload)

  // Sending actionst & errors to datadog
  useEffect(() => {
    if (!platformId) return
    addDatadogAction("Pasted a Telegram group ID")
  }, [platformId])

  useEffect(() => {
    if (!isIn || errorMessage) {
      addDatadogError("Telegram group ID error", { error: errorMessage }, "custom")
      return
    }

    if (isIn && !errorMessage) {
      trigger("guildPlatforms.0.platformGuildId")
      addDatadogAction("Telegram bot added successfully")
      addDatadogAction("Successful platform setup")
    }
  }, [isIn, errorMessage])

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="4" w="full">
        <FormControl>
          <FormLabel>1. Add bot</FormLabel>
          {!isIn ? (
            <Button
              h="10"
              w="full"
              as="a"
              href="https://t.me/guildxyz_bot?startgroup=true"
              target="_blank"
              isLoading={isLoading}
              disabled={isLoading}
              data-dd-action-name="Add bot (TELEGRAM)"
            >
              Add Guild bot
            </Button>
          ) : (
            <Button h="10" w="full" disabled rightIcon={<Check />}>
              Guild bot added
            </Button>
          )}
        </FormControl>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <FormControl isInvalid={!!errors?.guildPlatforms?.[0]?.platformGuildId}>
            <FormLabel>2. Enter group ID</FormLabel>
            <Input
              maxW={{ base: "full", lg: "50%" }}
              {...register("guildPlatforms.0.platformGuildId", {
                required: "This field is required.",
                pattern: {
                  value: /^-[0-9]+/i,
                  message: "A Group ID starts with a '-' and contains only numbers",
                },
                validate: () => isIn || errorMessage,
              })}
            />
            <FormErrorMessage>
              {errors?.guildPlatforms?.[0]?.platformGuildId?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>
      </SimpleGrid>
    </>
  )
}

export default TelegramGroup
