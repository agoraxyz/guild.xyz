import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import ColorButton from "components/common/ColorButton"
import { Gear } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useGuild } from "../Context"
import ColorPicker from "./components/ColorPicker"

const EditButton = (): JSX.Element => {
  const methods = useForm({ mode: "all" })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const { id, themeColor } = useGuild()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  useEffect(() => {
    methods.reset({
      themeColor,
    })
  }, [])

  return (
    <>
      <ColorButton
        color="primary.500"
        rounded="2xl"
        // isLoading={isLoading}
        onClick={onOpen}
      >
        <Icon as={Gear} />
      </ColorButton>

      <AlertDialog
        motionPreset={transition}
        leastDestructiveRef={cancelRef}
        {...{ isOpen, onClose }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <FormProvider {...methods}>
              <AlertDialogHeader>Edit Guild</AlertDialogHeader>

              <AlertDialogBody>
                <ColorPicker />
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  isDisabled={!methods.formState.isDirty}
                  colorScheme="primary"
                  onClick={() => console.log("onClick")}
                  ml={3}
                >
                  Save
                </Button>
              </AlertDialogFooter>
            </FormProvider>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default EditButton
