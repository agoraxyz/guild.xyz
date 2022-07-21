import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { platforms } from "components/create-guild/PlatformsGrid/PlatformsGrid"
import { ArrowLeft, Plus } from "phosphor-react"
import { useState } from "react"
import { PlatformName } from "types"
import AddDiscordPanel from "./components/AddDiscordPanel"
import AddTelegramPanel from "./components/AddTelegramPanel"

const addPlatformComponents: Partial<Record<PlatformName, (props) => JSX.Element>> =
  {
    DISCORD: AddDiscordPanel,
    TELEGRAM: AddTelegramPanel,
  }

const AddPlatformButton = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [selection, setSelection] = useState<PlatformName>(null)

  const AddPlatformPanel = addPlatformComponents[selection]

  const closeModal = () => {
    setSelection(null)
    onClose()
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        color="gray.400"
        leftIcon={<Plus />}
        onClick={onOpen}
      >
        Add platform
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="5xl"
        scrollBehavior="inside"
        colorScheme={"dark"}
      >
        <ModalOverlay />
        <ModalContent minH="70vh">
          <ModalHeader>
            <HStack>
              {selection !== null && (
                <IconButton
                  rounded={"full"}
                  aria-label="Back"
                  size="sm"
                  mb="-3px"
                  icon={<ArrowLeft size={20} />}
                  variant="ghost"
                  onClick={() => setSelection(null)}
                />
              )}
              <Text>
                Add{" "}
                {(selection === null && "platform") || platforms[selection].label}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalBody>
            {(selection === null && (
              <PlatformsGrid
                onSelection={setSelection}
                columns={{ base: 1, lg: 2 }}
              />
            )) || <AddPlatformPanel onClose={closeModal} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddPlatformButton
