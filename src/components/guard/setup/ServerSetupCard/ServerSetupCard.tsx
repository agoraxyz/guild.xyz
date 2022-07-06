import { Box, SimpleGrid, Stack } from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import useCreateGuild from "components/create-guild/hooks/useCreateGuild"
import useSetImageAndNameFromPlatformData from "components/create-guild/hooks/useSetImageAndNameFromPlatformData"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { AnimatePresence, LazyMotion, m } from "framer-motion"
import usePinata from "hooks/usePinata"
import useServerData from "hooks/useServerData"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { useRouter } from "next/router"
import { Check } from "phosphor-react"
import { useContext, useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"

const loadDomMaxFeatures = () =>
  import("../../../../framerMotion/domMax").then((res) => res.default)
const MotionStack = m(Stack)

const ServerSetupCard = ({ children }): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const router = useRouter()

  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)

  const { control, handleSubmit: formHandleSubmit, setValue } = useFormContext()

  const selectedServer = useWatch({
    control,
    name: "DISCORD.platformId",
  })

  const {
    data: { serverIcon, serverName },
  } = useServerData(selectedServer, {
    refreshInterval: 0,
  })

  const [watchedVideo, setWatchedVideo] = useState(
    router.pathname.includes("/create-guild")
  )

  const { onSubmit, isLoading, response, isSigning, error, signLoadingText } =
    useCreateGuild()

  useEffect(() => {
    if (error) {
      addDatadogError("Guild creation error", { error }, "custom")
    }
    if (response) {
      addDatadogAction("Successful guild creation")
    }
  }, [response, error])

  const { isUploading, onUpload } = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`)
    },
    onError: () => {
      setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
    },
  })

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    formHandleSubmit(onSubmit, console.log),
    isUploading
  )

  useSetImageAndNameFromPlatformData(serverIcon, serverName, onUpload)

  const loadingText = uploadLoadingText || signLoadingText || "Saving data"

  return (
    <CardMotionWrapper>
      <Card px={{ base: 5, sm: 6 }} py={7}>
        <Stack spacing={8}>
          <AnimatePresence initial={false} exitBeforeEnter>
            <LazyMotion features={loadDomMaxFeatures}>
              <MotionStack
                key={watchedVideo ? "form" : "video"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24 }}
                spacing={8}
              >
                {watchedVideo ? children : <DiscordRoleVideo />}
              </MotionStack>
            </LazyMotion>
          </AnimatePresence>

          <SimpleGrid columns={2} gap={4}>
            {watchedVideo ? (
              <>
                <Button
                  colorScheme="gray"
                  disabled={!!account}
                  onClick={openWalletSelectorModal}
                  rightIcon={!!account && <Check />}
                  data-dd-action-name="Connect wallet [dc server setup]"
                >
                  {!account ? "Connect wallet" : "Wallet connected"}
                </Button>

                <Button
                  colorScheme="green"
                  disabled={
                    !account ||
                    response ||
                    isLoading ||
                    isSigning ||
                    isUploadingShown
                  }
                  isLoading={isLoading || isSigning || isUploadingShown}
                  loadingText={loadingText}
                  onClick={handleSubmit}
                  data-dd-action-name="Sign to summon [dc server setup]"
                >
                  Sign to summon
                </Button>
              </>
            ) : (
              <>
                <Box />
                <Button colorScheme="green" onClick={() => setWatchedVideo(true)}>
                  Got it
                </Button>
              </>
            )}
          </SimpleGrid>
        </Stack>
      </Card>
    </CardMotionWrapper>
  )
}

export default ServerSetupCard
