import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"

type Props = {
  onClose: () => void
}

const defaultValues = {
  platformGuildId: null,
}

const AddDiscordPanel = ({ onClose }: Props) => {
  const methods = useForm({ mode: "all", defaultValues })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const platformGuildId = useWatch({
    control: methods.control,
    name: `platformGuildId`,
  })

  return (
    <FormProvider {...methods}>
      <DiscordGuildSetup
        fieldName={`platformGuildId`}
        selectedServer={platformGuildId}
        defaultValues={defaultValues}
        onSubmit={() => {
          append({
            guildPlatform: { platformName: "DISCORD", platformGuildId },
          })
          onClose()
        }}
      >
        <DiscordRoleVideo />
      </DiscordGuildSetup>
    </FormProvider>
  )
}

export default AddDiscordPanel
