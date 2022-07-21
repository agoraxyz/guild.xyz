import { Flex, VStack } from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import ErrorAnimation from "components/common/ErrorAnimation"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useCreateGuild from "components/create-guild/hooks/useCreateGuild"
import SetRequirements from "components/create-guild/Requirements"
import TelegramGroup from "components/create-guild/TelegramGroup"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useContext, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildFormType, PlatformType } from "types"
import getRandomInt from "utils/getRandomInt"

const defaultValues: GuildFormType = {
  name: "",
  description: "",
  imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
  guildPlatforms: [
    {
      platformId: PlatformType.TELEGRAM,
      platformName: "TELEGRAM",
      platformGuildId: "",
    },
  ],
}

const CreateTelegramGuildPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm<GuildFormType>({ mode: "all", defaultValues })
  const [formErrors, setFormErrors] = useState(null)
  const { openWalletSelectorModal, triedEager } = useContext(Web3Connection)

  const { isLoading, isSigning, onSubmit, response, signLoadingText } =
    useCreateGuild()
  const { isUploading, onUpload } = usePinata({
    onSuccess: ({ IpfsHash }) => {
      methods.setValue(
        "imageUrl",
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
      )
    },
    onError: () => {
      methods.setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
    },
  })

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    methods.handleSubmit(onSubmit, (errors) => {
      console.log(errors)
      return setFormErrors(errors ? Object.keys(errors) : null)
    }),
    isUploading
  )

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  useEffect(() => {
    if (triedEager && !account) openWalletSelectorModal()
  }, [account, triedEager])

  const loadingText = signLoadingText || uploadLoadingText || "Saving data"

  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="Create Guild on Telegram">
        {account ? (
          <FormProvider {...methods}>
            <ErrorAnimation errors={formErrors}>
              <VStack spacing={10} alignItems="start">
                <TelegramGroup
                  onUpload={onUpload}
                  fieldName="guildPlatforms.0.platformGuildId"
                />

                <SetRequirements />
              </VStack>
            </ErrorAnimation>
            <Flex justifyContent="right" mt="14">
              <Button
                flexShrink={0}
                size="lg"
                w={{ base: "full", sm: "auto" }}
                colorScheme="green"
                disabled={isLoading || isUploadingShown || isSigning || !!response}
                isLoading={isLoading || isUploadingShown || isSigning}
                loadingText={loadingText}
                onClick={handleSubmit}
                data-dd-action-name="Summon"
              >
                {response ? "Success" : "Summon"}
              </Button>
            </Flex>
            <DynamicDevTool control={methods.control} />
          </FormProvider>
        ) : (
          <ErrorAlert label="Please connect your wallet in order to continue!" />
        )}
      </Layout>
    </>
  )
}

export default WithRumComponentContext(
  "Create Telegram guild page",
  CreateTelegramGuildPage
)
