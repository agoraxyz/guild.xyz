import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import CtaButton from "components/common/CtaButton"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import useSubmitMachine from "components/create-guild/hooks/useSubmitMachine"
import NftFormCard from "components/create-guild/NftFormCard"
import PickGuildPlatform from "components/create-guild/PickGuildPlatform"
import PoapFormCard from "components/create-guild/PoapFormCard"
import StrategyFormCard from "components/create-guild/StrategyFormCard"
import TokenFormCard from "components/create-guild/TokenFormCard"
import { motion } from "framer-motion"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { RequirementType } from "temporaryData/types"
import slugify from "utils/slugify"

const CreateGuildPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })
  const { onSubmit, isLoading, isSuccess, state } = useSubmitMachine()
  const [errorAnimation, setErrorAnimation] = useState<string | string[]>(
    "translateX(0px)"
  )

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control: methods.control,
    name: "requirements",
  })

  const onSubmitHandler = (data) => onSubmit(data)

  const onErrorHandler = () =>
    setErrorAnimation([
      "translateX(0px) translateY(0px)",
      "translateX(-25px) translateY(0)",
      "translateX(25px) translateY(20px)",
      "translateX(-25px) translateY(10px)",
      "translateX(25px) translateY(10px)",
      "translateX(-25px) translateY(20px)",
      "translateX(25px) translateY(0px)",
      "translateX(0px) translateY(0px)",
    ])

  const requirementsLength = useWatch({
    control: methods.control,
    name: "requirements",
  })?.length

  const addRequirement = (type: RequirementType) => {
    appendRequirement({ type })
  }

  useEffect(() => {
    methods.register("urlName")
    methods.register("chainName", { value: "ETHEREUM" })
    methods.register("isGuild", { value: true })
  }, [])

  const guildName = useWatch({ control: methods.control, name: "name" })

  useEffect(() => {
    if (guildName) methods.setValue("urlName", slugify(guildName.toString()))
  }, [guildName])

  return (
    <FormProvider {...methods}>
      <Layout title="Create Guild">
        {account ? (
          <>
            <motion.div
              onAnimationComplete={() => setErrorAnimation("translateX(0px)")}
              style={{
                position: "relative",
                transformOrigin: "bottom center",
                transform: "translateX(0px)",
              }}
              animate={{
                transform: errorAnimation,
              }}
              transition={{ duration: 0.4 }}
            >
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a name for your Guild">
                  <FormControl isRequired isInvalid={methods.formState.errors?.name}>
                    <Input
                      maxWidth="sm"
                      size="lg"
                      {...methods.register("name", {
                        required: "This field is required.",
                      })}
                    />
                    <FormErrorMessage>
                      {methods.formState.errors?.name?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Section>

                <Section title="Choose a Realm">
                  <PickGuildPlatform />
                </Section>

                {requirementFields.length && (
                  <Section
                    title="Set requirements"
                    description="Set up one or more requirements for your guild"
                  >
                    <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 3 }}
                      spacing={{ base: 5, md: 6 }}
                    >
                      {requirementFields.map((requirementForm, i) => {
                        const type: RequirementType = methods.getValues(
                          `requirements.${i}.type`
                        )

                        switch (type) {
                          case "TOKEN":
                            return (
                              <TokenFormCard
                                key={requirementForm.id}
                                index={i}
                                onRemove={() => removeRequirement(i)}
                              />
                            )
                          case "POAP":
                            return (
                              <PoapFormCard
                                key={requirementForm.id}
                                index={i}
                                onRemove={() => removeRequirement(i)}
                              />
                            )
                          case "STRATEGY":
                            return (
                              <StrategyFormCard
                                key={requirementForm.id}
                                index={i}
                                onRemove={() => removeRequirement(i)}
                              />
                            )
                          default:
                            return (
                              <NftFormCard
                                key={requirementForm.id}
                                index={i}
                                onRemove={() => removeRequirement(i)}
                              />
                            )
                        }
                      })}
                    </SimpleGrid>
                  </Section>
                )}

                <Section
                  title={requirementFields.length ? "Add more" : "Set requirements"}
                  description={
                    !requirementFields.length &&
                    "Set up one or more requirements for your guild"
                  }
                >
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3 }}
                    spacing={{ base: 5, md: 6 }}
                  >
                    <AddCard
                      text="Hold an NFT"
                      clickHandler={() => addRequirement("NFT")}
                    />
                    <AddCard
                      text="Hold a Token"
                      clickHandler={() => addRequirement("TOKEN")}
                    />
                    <AddCard
                      text="Hold a POAP"
                      clickHandler={() => addRequirement("POAP")}
                    />
                    <AddCard
                      text="Snapshot strategy"
                      clickHandler={() => addRequirement("STRATEGY")}
                    />
                  </SimpleGrid>
                </Section>
              </VStack>
            </motion.div>
            <HStack
              w="full"
              mt={{ base: 0, md: 8 }}
              alignItems="center"
              justifyContent="center"
            >
              <CtaButton
                disabled={!account || !requirementsLength || isLoading || isSuccess}
                flexShrink={0}
                isLoading={isLoading}
                loadingText={(() => {
                  switch (state.value) {
                    case "sign":
                      return "Signing"
                    case "fetchCommunity":
                      return "Saving data"
                    case "fetchLevels":
                      return "Saving requirements"
                    default:
                      return undefined
                  }
                })()}
                onClick={methods.handleSubmit(onSubmitHandler, onErrorHandler)}
              >
                {isSuccess ? "Success" : "Summon"}
              </CtaButton>
            </HStack>
          </>
        ) : (
          <Alert status="error" mb="6">
            <AlertIcon />
            <Stack>
              <AlertDescription position="relative" top={1}>
                Please connect your wallet in order to continue!
              </AlertDescription>
            </Stack>
          </Alert>
        )}
      </Layout>
    </FormProvider>
  )
}

export default CreateGuildPage
