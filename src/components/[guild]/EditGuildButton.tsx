import { IconButton, useDisclosure } from "@chakra-ui/react"
import OnboardingMarker from "components/common/OnboardingMarker"
import { GearSix } from "phosphor-react"
import EditGuild from "./EditGuild"
import { useOnboardingContext } from "./Onboarding/components/OnboardingProvider"

const EditGuildButton = (): JSX.Element => {
  const {
    isOpen: isEditGuildOpen,
    onOpen: onEditGuildOpen,
    onClose: onEditGuildClose,
  } = useDisclosure()

  const { localStep } = useOnboardingContext()

  return (
    <>
      <OnboardingMarker step={1}>
        <IconButton
          icon={<GearSix />}
          aria-label="Edit Guild"
          minW={"44px"}
          rounded="full"
          colorScheme="alpha"
          data-dd-action-name={
            localStep === null ? "Edit guild" : "Edit guild [onboarding]"
          }
          onClick={onEditGuildOpen}
        />
      </OnboardingMarker>

      <EditGuild
        {...{
          isOpen: isEditGuildOpen,
          onOpen: onEditGuildOpen,
          onClose: onEditGuildClose,
        }}
      />
    </>
  )
}

export default EditGuildButton
