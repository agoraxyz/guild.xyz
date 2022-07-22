import {
  Box,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Icon,
  Image,
  Select,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useGuild from "components/[guild]/hooks/useGuild"
import useSendJoin from "components/[guild]/Onboarding/components/SummonMembers/hooks/useSendJoin"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import { AnimatePresence, motion } from "framer-motion"
import useServerData from "hooks/useServerData"
import { ArrowRight, LockSimple } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSWRConfig } from "swr"
import { useCreatePoapContext } from "../CreatePoapContext"
import EmbedButton from "./components/EmbedButton"
import EmbedDescription from "./components/EmbedDescription"
import EmbedTitle from "./components/EmbedTitle"

const MotionBox = motion(Box)

type PoapDiscordEmbedForm = {
  channelId: string
  title: string
  description: string
  button: string
}

const EMBED_IMAGE_SIZE = "70px"

const SetupBot = (): JSX.Element => {
  const { poapData, onCloseHandler } = useCreatePoapContext()

  const embedBg = useColorModeValue("gray.100", "#2F3136")

  const { urlName, name, imageUrl, guildPlatforms } = useGuild()
  const { authorization, onOpen: onAuthOpen, isAuthenticating } = useDCAuth("guilds")
  const {
    data: { categories },
  } = useServerData(guildPlatforms?.[0]?.platformGuildId, { authorization })

  const mappedChannels = useMemo(() => {
    if (!categories?.length) return []

    return (
      Object.values(categories)
        ?.map((category) => category.channels)
        ?.flat() ?? []
    )
  }, [categories])

  const shouldShowGuildImage = imageUrl.includes("http")

  const methods = useForm<PoapDiscordEmbedForm>({
    mode: "onSubmit",
    defaultValues: {
      title: poapData?.name,
      description: "Claim this magnificent POAP to your collection!",
      button: "Claim POAP",
    },
  })

  useEffect(() => {
    if (!methods.register) return
    methods.register("channelId", { required: "This field is required " })
  }, [])

  useEffect(() => {
    if (!authorization) return
    methods.clearErrors("channelId")
  }, [authorization])

  const triggerConfetti = useJsConfetti()
  const { mutate } = useSWRConfig()

  const { isLoading, isSigning, onSubmit, response, signLoadingText } = useSendJoin(
    "POAP",
    () => {
      triggerConfetti()
      // Mutating the guild data, so we get back the correct "activated" status for the POAPs
      mutate([`/guild/details/${urlName}`, { method: "POST", body: {} }])
    }
  )

  const loadingText = signLoadingText || "Sending"

  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      <MotionBox
        key={response ? "success" : "setup-form"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24 }}
      >
        {response ? (
          <VStack spacing={6}>
            <VStack
              pb={32}
              spacing={6}
              alignItems={{ base: "start", md: "center" }}
              bg="url('/img/poap-illustration.svg') no-repeat bottom center"
            >
              <Text fontSize="3xl" fontFamily="display" fontWeight="bold">
                Hooray!
              </Text>
              <Text textAlign={{ base: "left", md: "center" }} maxW="md">
                You've successfully dropped a POAP and set up a claim button on your
                Discord server for it - now your friends can claim this magnificent
                POAP to their collection!
              </Text>
            </VStack>

            <Flex w="full" justifyContent="end">
              <Button colorScheme="indigo" onClick={onCloseHandler}>
                Done
              </Button>
            </Flex>
          </VStack>
        ) : (
          <VStack spacing={12} alignItems={{ base: "start", md: "center" }}>
            <Text textAlign={{ base: "left", md: "center" }}>
              Feel free to customize the embed below - the bot will send this to your
              Discord server and your Guild's members will be able to claim their
              POAP using the button in it.
            </Text>

            <FormProvider {...methods}>
              <Box mx="auto" w="full" maxW="md">
                <FormControl
                  isRequired
                  isInvalid={!!methods.formState.errors?.channelId}
                >
                  <FormLabel>Channel to send to</FormLabel>

                  {!authorization?.length ? (
                    <Button
                      onClick={onAuthOpen}
                      isLoading={isAuthenticating}
                      loadingText="Check the popup window"
                      spinnerPlacement="end"
                      rightIcon={<LockSimple />}
                      variant="outline"
                      w="full"
                      h={12}
                      justifyContent="space-between"
                    >
                      Authenticate to view channels
                    </Button>
                  ) : mappedChannels?.length <= 0 ? (
                    <Button
                      isDisabled
                      isLoading
                      loadingText="Loading channels"
                      w="full"
                    />
                  ) : (
                    <Select
                      {...methods.register("channelId", {
                        required: "This field is required ",
                      })}
                      maxW="sm"
                    >
                      {mappedChannels.map((channel, index) => (
                        <option
                          key={channel.id}
                          value={channel.id}
                          defaultChecked={index === 0}
                        >
                          {channel.name}
                        </option>
                      ))}
                    </Select>
                  )}

                  <FormErrorMessage>
                    {methods.formState.errors?.channelId?.message}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              <FormControl
                maxW="md"
                mb={12}
                isInvalid={
                  !!methods.formState.errors.title ||
                  !!methods.formState.errors.description ||
                  !!methods.formState.errors.button
                }
              >
                <Box mx="auto" maxW="md">
                  <Box
                    bg={embedBg}
                    borderRadius={"4px"}
                    mb={2}
                    p={4}
                    borderLeft={"4px solid var(--chakra-colors-DISCORD-500)"}
                  >
                    <Grid templateColumns={`1fr ${EMBED_IMAGE_SIZE}`} gap={3}>
                      <VStack alignItems="left">
                        <HStack spacing={2}>
                          <Center
                            h="26px"
                            w="26px"
                            borderRadius="full"
                            overflow={"hidden"}
                          >
                            {shouldShowGuildImage && imageUrl && (
                              <Image
                                width={26}
                                height={26}
                                src={imageUrl}
                                alt="Guild Icon"
                              />
                            )}
                          </Center>

                          <Text fontSize={"sm"} fontWeight="bold">
                            {name}
                          </Text>
                        </HStack>

                        <EmbedTitle />
                        <EmbedDescription />
                      </VStack>

                      <Box m={1} boxSize={EMBED_IMAGE_SIZE}>
                        <Image src="/requirementLogos/poap.svg" alt="POAP image" />
                      </Box>
                    </Grid>

                    <Text mt={2} fontSize="xs">
                      Do not share your private keys. We will never ask for your seed
                      phrase.
                    </Text>
                  </Box>
                  <EmbedButton />
                </Box>

                <FormErrorMessage>Some fields are empty</FormErrorMessage>
              </FormControl>

              <Flex w="full" justifyContent="end">
                <Button
                  colorScheme="indigo"
                  rightIcon={<Icon as={ArrowRight} />}
                  onClick={methods.handleSubmit(onSubmit, console.log)}
                  isLoading={isLoading || isSigning}
                  loadingText={loadingText}
                  isDisabled={isLoading || isSigning || response}
                >
                  Send embed
                </Button>
              </Flex>

              <DynamicDevTool control={methods.control} />
            </FormProvider>
          </VStack>
        )}
      </MotionBox>
    </AnimatePresence>
  )
}

export default SetupBot
