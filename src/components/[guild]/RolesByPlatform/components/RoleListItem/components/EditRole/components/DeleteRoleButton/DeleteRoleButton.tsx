import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  FormLabel,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import DeleteButton from "components/[guild]/DeleteButton"
import ShouldKeepPlatformAccesses from "components/[guild]/ShouldKeepPlatformAccesses"
import { useRef, useState } from "react"
import useDeleteRole from "./hooks/useDeleteRole"

type Props = {
  roleId: number
}

const DeleteRoleButton = ({ roleId }: Props): JSX.Element => {
  const [removeAccess, setRemoveAccess] = useState(0)
  const { onSubmit, isLoading, signLoadingText } = useDeleteRole(roleId)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  return (
    <>
      <DeleteButton label="Delete role" onClick={onOpen} />
      <Alert
        leastDestructiveRef={cancelRef}
        {...{ isOpen, onClose }}
        size="xl"
        colorScheme={"dark"}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete role</AlertDialogHeader>
            <AlertDialogBody>
              <FormLabel mb="3">
                What to do with existing members on the platforms?
              </FormLabel>
              <ShouldKeepPlatformAccesses
                keepAccessDescription="Everything on the platforms will remain as is for existing members, but accesses by this role won’t be managed anymore"
                revokeAccessDescription="Existing members will lose every access granted by this role"
                onChange={(newValue) => setRemoveAccess(+newValue)}
                value={removeAccess}
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                isLoading={isLoading}
                loadingText={signLoadingText || "Deleting"}
                onClick={() => onSubmit({ removePlatformAccess: removeAccess })}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </>
  )
}

export default DeleteRoleButton
