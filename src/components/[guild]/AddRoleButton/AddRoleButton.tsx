import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Stack,
  StackDivider,
  Tooltip,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import IconSelector from "components/create-guild/IconSelector"
import LogicPicker from "components/create-guild/LogicPicker"
import Name from "components/create-guild/Name"
import PlatformOption from "components/create-guild/PickRolePlatform/components/PlatformOption"
import SetRequirements from "components/create-guild/Requirements"
import useGuild from "components/[guild]/hooks/useGuild"
import useUploadPromise from "hooks/useUploadPromise"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Info, Plus } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useController, useForm } from "react-hook-form"
import ChannelsToGate from "../RolesByPlatform/components/RoleListItem/components/EditRole/components/ChannelsToGate"
import ExistingRoleSettings from "./components/ExistingRoleSettings"

const roleOptions = [
  {
    value: "NEW",
    title: "Create a new role",
    description:
      "The Guild.xyz bot will create a new role, and use that one to manage accesses to the specified channels.",
  },
  {
    value: "EXISTING",
    title: "Use an existing role",
    description:
      "The Guild.xyz bot will use the specified existing role to manage accesses.",
    children: <ExistingRoleSettings />,
  },
]

const AddRoleButton = (): JSX.Element => {
  const { id, platforms } = useGuild()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalFocusRef = useRef(null)
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { onSubmit, isLoading, response, isSigning } = useCreateRole()

  const defaultValues = {
    guildId: id,
    ...(platforms?.[0]
      ? {
          platform: platforms[0].type,
          platformId: platforms[0].platformId,
        }
      : {}),
    // channelId: platforms?.[0]?.inviteChannel,
    name: "",
    description: "",
    logic: "AND",
    requirements: [],
    roleType: "NEW",
    activationInterval: 0,
    includeUnauthenticated: true,
  }

  const methods = useForm({
    mode: "all",
    defaultValues,
  })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const onCloseAndClear = () => {
    methods.reset(defaultValues)
    onAlertClose()
    onClose()
  }

  useEffect(() => {
    if (!response) return

    onClose()
    methods.reset(defaultValues)
  }, [response])

  const { handleSubmit, shouldBeLoading, isUploading, setUploadPromise } =
    useUploadPromise(methods.handleSubmit)

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving data"
  }

  const { field } = useController({
    control: methods.control,
    name: "roleType",
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "platform",
    onChange: field.onChange,
    value: field.value,
  })

  const group = getRootProps()

  const { colorMode } = useColorMode()

  return (
    <>
      <Button
        ref={finalFocusRef}
        variant="ghost"
        w="full"
        opacity="0.5"
        h="16"
        iconSpacing={{ base: 6, md: 10 }}
        justifyContent="left"
        leftIcon={<Icon as={Plus} boxSize="1.2em" />}
        onClick={onOpen}
        data-dd-action-name="Add role"
      >
        Add role
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        size={drawerSize}
        onClose={methods.formState.isDirty ? onAlertOpen : onClose}
        finalFocusRef={finalFocusRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="custom-scrollbar">
            <DrawerHeader title="Add role" />
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <Stack
                  w="full"
                  spacing="6"
                  direction={{ base: "column", md: "row" }}
                >
                  <Section title="Choose a logo and name for your role">
                    <HStack spacing={2} alignItems="start">
                      <IconSelector setUploadPromise={setUploadPromise} />
                      <Name />
                    </HStack>
                  </Section>
                  <Section
                    title="Choose channels to gate"
                    w="full"
                    titleRightElement={
                      <Tooltip
                        label="Choose the channels / categories you want only members with this role to see"
                        shouldWrapChildren
                      >
                        <Info />
                      </Tooltip>
                    }
                  >
                    <ChannelsToGate />
                  </Section>
                </Stack>

                <FormControl
                  isRequired
                  isInvalid={!!methods?.formState?.errors?.platform}
                >
                  <VStack
                    {...group}
                    borderRadius="xl"
                    bg={colorMode === "light" ? "white" : "blackAlpha.300"}
                    spacing="0"
                    border="1px"
                    borderColor={
                      colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"
                    }
                    divider={<StackDivider />}
                  >
                    {roleOptions.map((option) => {
                      const radio = getRadioProps({ value: option.value })
                      return (
                        <PlatformOption
                          key={option.value}
                          {...radio}
                          {...option}
                          color="DISCORD"
                        />
                      )
                    })}
                  </VStack>

                  <FormErrorMessage>
                    {methods?.formState?.errors?.platform?.message}
                  </FormErrorMessage>
                </FormControl>

                <Section title="Role description">
                  <Description />
                </Section>

                <Section title="Requirements logic">
                  <LogicPicker />
                </Section>

                <SetRequirements maxCols={2} />
              </VStack>
            </FormProvider>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onCloseAndClear}>
              Cancel
            </Button>
            <Button
              disabled={isLoading || isSigning || shouldBeLoading}
              isLoading={isLoading || isSigning || shouldBeLoading}
              colorScheme="green"
              loadingText={loadingText()}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
        <DynamicDevTool control={methods.control} />
      </Drawer>

      <DiscardAlert
        {...{
          isOpen: isAlertOpen,
          onClose: onAlertClose,
          onDiscard: onCloseAndClear,
        }}
      />
    </>
  )
}

export default AddRoleButton
