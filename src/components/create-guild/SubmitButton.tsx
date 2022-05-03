import Button from "components/common/Button"
import { useSigningManager } from "components/_app/SigningManager"
import useUploadPromise from "hooks/useUploadPromise"
import { PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"
import useCreateGuild from "./hooks/useCreateGuild"

type Props = {
  uploadPromise: Promise<void>
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({
  uploadPromise,
  onErrorHandler,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { onSubmit, isLoading, response } = useCreateGuild()
  const { isSigning } = useSigningManager()
  const { handleSubmit: formHandleSubmit } = useFormContext()

  const { handleSubmit, shouldBeLoading, isUploading } = useUploadPromise(
    formHandleSubmit,
    uploadPromise
  )

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving data"
  }

  return (
    <Button
      disabled={isLoading || shouldBeLoading || isSigning || !!response}
      flexShrink={0}
      size="lg"
      w={{ base: "full", sm: "auto" }}
      colorScheme="green"
      isLoading={isLoading || shouldBeLoading || isSigning}
      loadingText={loadingText()}
      onClick={handleSubmit(onSubmit, onErrorHandler)}
      data-dd-action-name="Summon"
    >
      {response ? "Success" : children}
    </Button>
  )
}

export default SubmitButton
