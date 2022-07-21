import {
  Box,
  Divider,
  HStack,
  Icon,
  Img,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { Step, Steps } from "chakra-ui-steps"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useGuild from "components/[guild]/hooks/useGuild"
import { AnimatePresence, motion } from "framer-motion"
import { Plus } from "phosphor-react"
import {
  CreatePoapProvider,
  useCreatePoapContext,
} from "./components/CreatePoapContext"
import CreatePoapForm from "./components/CreatePoapForm"
import MonetizePoap from "./components/MonetizePoap"
import PoapListItem from "./components/PoapListItem"
import SetupBot from "./components/SetupBot"
import UploadMintLinks from "./components/UploadMintLinks"

const steps = [
  {
    label: "Create a POAP",
    content: CreatePoapForm,
  },
  {
    label: "Upload mint links",
    content: UploadMintLinks,
  },
  {
    label: "Monetize POAP",
    content: MonetizePoap,
  },
  {
    label: "Set up bot",
    content: SetupBot,
  },
]

type Props = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

type WrapperProps = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  discordServerId: string
}

const MotionBox = motion(Box)
const MotionModalContent = motion(ModalContent)

const CreatePoap = ({ isOpen }: Props): JSX.Element => {
  const poapListBg = useColorModeValue("gray.50", "blackAlpha.300")
  const modalBg = useColorModeValue(undefined, "gray.800")

  const { poaps } = useGuild()
  const {
    activeStep,
    poapData,
    shouldCreatePoap,
    setShouldCreatePoap,
    onCloseHandler,
  } = useCreatePoapContext()

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler} size="4xl">
      <ModalOverlay />
      <MotionModalContent
        mt={16}
        mb={{ base: 0, md: 16 }}
        initial={{
          maxWidth: !poaps?.length
            ? "var(--chakra-sizes-4xl)"
            : "var(--chakra-sizes-lg)",
        }}
        animate={{
          maxWidth:
            poapData?.id || shouldCreatePoap || !poaps?.length
              ? "var(--chakra-sizes-4xl)"
              : "var(--chakra-sizes-lg)",
        }}
      >
        <ModalHeader bgColor={modalBg}>
          <HStack>
            <Img
              position="relative"
              top={0.5}
              src="/requirementLogos/poap.svg"
              boxSize={6}
            />
            <Text as="span">
              {shouldCreatePoap
                ? "Create a POAP"
                : poaps?.length && activeStep === 0
                ? "Choose a POAP"
                : "Drop POAP"}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalBody bgColor={modalBg}>
          <AnimatePresence initial={false} exitBeforeEnter>
            <MotionBox
              key={
                poaps?.length && !poapData?.id && !shouldCreatePoap
                  ? "select-poap"
                  : "create-poap"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
            >
              {poaps?.length && !poapData?.id && !shouldCreatePoap ? (
                <Stack spacing={4} mx="auto" maxW="md">
                  <Stack
                    p={4}
                    bgColor={poapListBg}
                    borderRadius="2xl"
                    divider={<Divider />}
                  >
                    {poaps.map((poap) => (
                      <PoapListItem key={poap?.id} poapFancyId={poap?.fancyId} />
                    ))}
                  </Stack>

                  <HStack>
                    <Divider />
                    <Text as="span" fontWeight="bold" fontSize="sm" color="gray">
                      OR
                    </Text>
                    <Divider />
                  </HStack>

                  <Button
                    colorScheme="indigo"
                    leftIcon={<Icon as={Plus} />}
                    onClick={() => setShouldCreatePoap(true)}
                  >
                    Create a POAP
                  </Button>
                </Stack>
              ) : (
                <Steps colorScheme="indigo" size="sm" activeStep={activeStep}>
                  {steps.map(({ label, content: Content }) => (
                    <Step label={label} key={label}>
                      <Box pt={{ base: 6, md: 12 }}>
                        <Content />
                      </Box>
                    </Step>
                  ))}
                </Steps>
              )}
            </MotionBox>
          </AnimatePresence>
        </ModalBody>
      </MotionModalContent>
    </Modal>
  )
}

const CreatePoapWrapper = ({
  isOpen,
  onClose,
  onOpen,
  discordServerId,
}: WrapperProps): JSX.Element => (
  <CreatePoapProvider onClose={onClose} discordServerId={discordServerId}>
    <CreatePoap {...{ isOpen, onClose, onOpen }} />
  </CreatePoapProvider>
)

export default CreatePoapWrapper
