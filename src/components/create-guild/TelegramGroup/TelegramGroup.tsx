import { FormControl, FormLabel, HStack, Icon, Input, Stack } from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import Button from "components/common/Button"
import Card from "components/common/Card"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Uploader } from "hooks/usePinata/usePinata"
import { ArrowSquareOut, Check } from "phosphor-react"
import { PropsWithChildren, useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import useSetImageAndNameFromPlatformData from "../hooks/useSetImageAndNameFromPlatformData"
import useIsTGBotIn from "./hooks/useIsTGBotIn"

type Props = {
  fieldName: string
  onUpload?: Uploader["onUpload"]
}

const TelegramGroup = ({
  fieldName,
  onUpload,
  children,
}: PropsWithChildren<Props>) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext()

  const platformId = useWatch({
    name: fieldName,
  })

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
      trigger(fieldName)
      addDatadogAction("Telegram bot added successfully")
      addDatadogAction("Successful platform setup")
    }
  }, [isIn, errorMessage])

  return (
    <>
      <Card p={8} w="full">
        <Stack direction={{ base: "column", md: "row" }} spacing="4" w="full">
          <FormControl>
            <FormLabel>1. Add bot</FormLabel>
            {!isIn ? (
              <Button
                w="full"
                as="a"
                h="var(--chakra-space-11)"
                href="https://t.me/guildxyz_bot?startgroup=true"
                target="_blank"
                rightIcon={<Icon as={ArrowSquareOut} mt="-1px" />}
                isLoading={isLoading}
                disabled={isLoading}
                data-dd-action-name="Add bot (TELEGRAM)"
              >
                Add Guild bot
              </Button>
            ) : (
              <Button
                h="var(--chakra-space-11)"
                w="full"
                disabled
                rightIcon={<Check />}
              >
                Guild bot added
              </Button>
            )}
          </FormControl>
          <FormControl isInvalid={!!parseFromObject(errors, fieldName)}>
            <FormLabel>2. Enter group ID</FormLabel>
            <Input
              h="var(--chakra-space-11)"
              borderRadius={"xl"}
              {...register(fieldName, {
                required: "This field is required.",
                pattern: {
                  value: /^-[0-9]+/i,
                  message: "A Group ID starts with a '-' and contains only numbers",
                },
                validate: () => isIn || errorMessage,
              })}
            />
            <FormErrorMessage>
              {parseFromObject(errors, fieldName)?.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
        {children && (
          <HStack justifyContent={"end"} mt={8}>
            {children}
          </HStack>
        )}
      </Card>
    </>
  )
}

export default TelegramGroup
