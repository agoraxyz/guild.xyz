import { SimpleGrid, Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import useCreateGuild from "components/create-guild/hooks/useCreateGuild"
import EntryChannel from "components/create-guild/PickRolePlatform/components/Discord/components/EntryChannel"
import useServerData from "components/create-guild/PickRolePlatform/components/Discord/hooks/useServerData"
import useSetImageAndNameFromPlatformData from "components/create-guild/PickRolePlatform/hooks/useSetImageAndNameFromPlatformData"
import useEditGuild from "components/[guild]/EditGuildButton/hooks/useEditGuild"
import { useSigningManager } from "components/_app/SigningManager"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useUploadPromise from "hooks/useUploadPromise"
import { useRouter } from "next/router"
import { useContext, useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useGuildByPlatformId from "../hooks/useGuildByPlatformId"
import Disclaimer from "./components/Disclaimer"
import PickSecurityLevel from "./components/PickSecurityLevel/PickSecurityLevel"

const ServerSetupCard = (): JSX.Element => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)
  const router = useRouter()

  const { control, setValue, handleSubmit: formHandleSubmit } = useFormContext()

  const selectedServer = useWatch({
    control,
    name: "DISCORD.platformId",
  })

  const {
    data: { channels, serverIcon, serverName },
  } = useServerData(selectedServer, {
    refreshInterval: 0,
  })

  const [uploadPromise, setUploadPromise] = useState(null)
  useSetImageAndNameFromPlatformData(serverIcon, serverName, setUploadPromise)

  const { handleSubmit, isUploading, shouldBeLoading } = useUploadPromise(
    formHandleSubmit,
    uploadPromise
  )

  const { onSubmit, isLoading, response } = useCreateGuild()
  const { isSigning } = useSigningManager()

  const { id, urlName, roles, platforms } = useGuildByPlatformId(selectedServer)

  useEffect(() => {
    if (!roles) return

    setValue("channelId", roles[0].platforms?.[0]?.inviteChannel)
    setValue("requirements", undefined)
    setValue("imageUrl", undefined, { shouldTouch: true })
    setValue("name", undefined, { shouldTouch: true })

    const hasFreeEntry = roles.some((role) =>
      role.requirements.some((req) => req.type === "FREE")
    )

    if (!hasFreeEntry) {
      setValue("roles", [
        {
          guildId: id,
          ...(platforms?.[0]
            ? {
                platform: platforms[0].type,
                platformId: platforms[0].platformId,
              }
            : {}),
          name: "Verified",
          description: "",
          logic: "AND",
          requirements: [{ type: "FREE" }],
          imageUrl: "/guildLogos/0.svg",
        },
      ])
    } else {
      setValue("roles", undefined)
    }
  }, [roles])

  const {
    onSubmit: onEditSubmit,
    isLoading: isEditLoading,
    response: editResponse,
  } = useEditGuild({ guildId: id, onSuccess: () => router.push(`/${urlName}`) })

  const loadingText = useMemo((): string => {
    if (isUploading) return "Uploading Guild image"
    if (isSigning) return "Check your wallet"
    return "Saving data"
  }, [isSigning, isUploading])

  return (
    <CardMotionWrapper>
      <Card px={{ base: 5, sm: 6 }} py={7}>
        <Stack spacing={8}>
          <EntryChannel
            channels={channels}
            label="Entry channel"
            tooltip={
              id
                ? "Select the channel your join button is already in! Newly joined accounts will only see this on your server until they authenticate"
                : "Newly joined accounts will only see this channel with a join button in it by the Guild.xyz bot until they authenticate"
            }
            showCreateOption={!id}
            maxW="50%"
            size="lg"
          />

          <PickSecurityLevel />

          <Disclaimer />

          <SimpleGrid columns={2} gap={4}>
            <Button
              colorScheme="gray"
              disabled={!!account}
              onClick={openWalletSelectorModal}
            >
              Connect wallet
            </Button>

            <Button
              colorScheme="green"
              disabled={
                !account ||
                response ||
                editResponse ||
                isLoading ||
                isSigning ||
                shouldBeLoading ||
                isEditLoading
              }
              isLoading={isLoading || isSigning || shouldBeLoading || isEditLoading}
              loadingText={loadingText}
              onClick={handleSubmit(id ? onEditSubmit : onSubmit, console.log)}
            >
              Let's go!
            </Button>
          </SimpleGrid>
        </Stack>
      </Card>
    </CardMotionWrapper>
  )
}

export default ServerSetupCard
