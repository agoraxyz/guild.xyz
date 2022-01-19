import {
  Button,
  FormControl,
  FormLabel,
  GridItem,
  Input,
  SimpleGrid,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Check } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useIsTGBotIn from "./hooks/useIsTGBotIn"

const TelegramGroup = () => {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext()

  const platform = useWatch({ name: "platform" })
  const tgPlatformId = useWatch({ name: "tgPlatformId" })

  const {
    data: { ok: isIn, message: errorMessage },
    isLoading,
  } = useIsTGBotIn(tgPlatformId)

  useEffect(() => {
    if (isIn && !errorMessage) {
      trigger("tgPlatformId")
    }
  }, [isIn, errorMessage])

  return (
    <>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing="4"
        px="5"
        py="4"
        w="full"
      >
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
            >
              Add Guildxyz bot
            </Button>
          ) : (
            <Button h="10" w="full" disabled rightIcon={<Check />}>
              Guildxyz bot added
            </Button>
          )}
        </FormControl>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <FormControl isInvalid={errors?.tgPlatformId}>
            <FormLabel>2. Enter group ID</FormLabel>
            <Input
              maxW={{ base: "full", lg: "50%" }}
              {...register("tgPlatformId", {
                required: platform === "TELEGRAM" && "This field is required.",
                validate: () => platform !== "TELEGRAM" || isIn || errorMessage,
              })}
            />
            <FormErrorMessage>{errors?.tgPlatformId?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </SimpleGrid>
    </>
  )
}

export default TelegramGroup
