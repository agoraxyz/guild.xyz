import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import useUploadPromise from "hooks/useUploadPromise"
import { PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"
import useCreate from "./hooks/useCreate"

type Props = {
  uploadPromise: Promise<void>
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({
  uploadPromise,
  onErrorHandler,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, response } = useCreate()
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
    <CtaButton
      disabled={isLoading || shouldBeLoading || isSigning || response}
      flexShrink={0}
      size="lg"
      colorScheme="green"
      variant="solid"
      isLoading={isLoading || shouldBeLoading || isSigning}
      loadingText={loadingText()}
      onClick={handleSubmit(onSubmit, onErrorHandler)}
    >
      {response ? "Success" : children}
    </CtaButton>
  )
}

export default SubmitButton
