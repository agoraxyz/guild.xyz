import {
  Button,
  Flex,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { useRef } from "react"
import { Platform } from "types"
import { useRolePlatform } from "../../RolePlatformProvider"
import DiscordCard from "./DiscordCard"
import ChannelsToGate from "./DiscordCard/components/ChannelsToGate"
import DiscordLabel from "./DiscordCard/components/DiscordLabel"
import RoleToManage from "./DiscordCard/components/RoleToManage"

type Props = {
  guildPlatform: Platform
  cornerButton: JSX.Element
}

const DiscordFormCard = ({ guildPlatform, cornerButton }: Props): JSX.Element => {
  const { isNewRole } = useRolePlatform()
  const modalContentRef = useRef()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <DiscordCard
      guildPlatform={guildPlatform}
      cornerButton={cornerButton}
      actionRow={
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "stretch", md: "center" }}
        >
          {(isNewRole && <DiscordLabel isAdded />) || <DiscordLabel />}

          <Button
            size="sm"
            onClick={onOpen}
            ml={{ base: 0, md: 3 }}
            mt={{ base: 3, md: 0 }}
          >
            Edit
          </Button>

          <Modal
            {...{ isOpen, onClose }}
            scrollBehavior="inside"
            colorScheme={"dark"}
            initialFocusRef={modalContentRef}
          >
            <ModalOverlay />
            <ModalContent
              minW={isNewRole ? { md: "xl" } : undefined}
              ref={modalContentRef}
            >
              <ModalHeader>Discord settings</ModalHeader>
              <ModalBody>
                <VStack spacing={8} alignItems="start">
                  {isNewRole && <RoleToManage />}
                  <ChannelsToGate />
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="green" onClick={onClose}>
                  Done
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      }
    />
  )
}

export default DiscordFormCard
