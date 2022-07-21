import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import EntryChannel from "components/create-guild/EntryChannel"
import Disclaimer from "components/guard/setup/ServerSetupCard/components/Disclaimer"
import PickSecurityLevel from "components/guard/setup/ServerSetupCard/components/PickSecurityLevel"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { useRouter } from "next/router"
import { useEffect } from "react"
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"

const defaultValues = {
  name: "",
  description: "",
  imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
  roles: [
    {
      name: "Member",
      logic: "AND",
      requirements: [{ type: "FREE" }],
      rolePlatforms: [
        {
          guildPlatformIndex: 0,
        },
      ],
    },
  ],
  guildPlatforms: [
    {
      platformName: "DISCORD",
      platformGuildId: undefined,
      platformGuildData: {
        inviteChannel: "",
      },
    },
  ],
}

const Page = (): JSX.Element => {
  const router = useRouter()

  const { authorization } = useDCAuth("guilds")

  useEffect(() => {
    if (!authorization) {
      router.push("/guard")
    }
  }, [authorization])

  const methods = useFormContext<GuildFormType>()
  const { errors } = useFormState()

  const selectedServer = useWatch({
    control: methods.control,
    name: "guildPlatforms.0.platformGuildId",
  })

  const {
    data: { channels },
  } = useServerData(selectedServer, {
    refreshInterval: 0,
  })

  return (
    <Layout title={selectedServer ? "Set up Guild Guard" : "Select a server"}>
      <FormProvider {...methods}>
        <DiscordGuildSetup
          {...{ defaultValues, selectedServer }}
          fieldName="guildPlatforms.0.platformGuildId"
        >
          <EntryChannel
            channels={channels}
            label="Entry channel"
            tooltip={
              "Newly joined accounts will only see this channel with a join button in it by the Guild.xyz bot until they authenticate"
            }
            showCreateOption
            maxW="50%"
            size="lg"
            fieldName="guildPlatforms.0.inviteChannel"
            errorMessage={errors.guildPlatform?.[0]?.inviteChannel}
          />

          <PickSecurityLevel rolePlatformIndex={0} />

          <Disclaimer />
        </DiscordGuildSetup>

        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </Layout>
  )
}

const WrappedPage = () => {
  // TODO: form type
  const methods = useForm<any>({
    mode: "all",
    defaultValues,
  })

  return (
    <FormProvider {...methods}>
      <Page />
    </FormProvider>
  )
}

export default WrappedPage
