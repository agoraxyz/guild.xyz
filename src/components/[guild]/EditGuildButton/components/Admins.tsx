import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  UnorderedList,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useGuildMembers from "hooks/useGuildMembers"
import { ArrowSquareOut } from "phosphor-react"
import { useMemo } from "react"
import { Controller, useForm, useFormContext, useWatch } from "react-hook-form"
import { SelectOption } from "types"
import shortenHex from "utils/shortenHex"

const Admins = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setValue, control } = useFormContext()
  const admins = useWatch({ name: "admins" })
  const addressShorten = useBreakpointValue({ base: 10, sm: 15, md: -1 })

  const members = useGuildMembers()
  const memberOptions = useMemo(
    () =>
      [...members]
        .filter((address) => !admins.includes(address))
        .map((member) => ({ label: member, value: member })),
    [members, admins]
  )

  const form = useForm({
    mode: "all",
    defaultValues: { adminInput: "" },
    shouldFocusError: true,
  })

  const closeModal = () => {
    form.clearErrors("adminInput")
    onClose()
  }

  const adminInput = useWatch({ name: "adminInput", control: form.control })

  const lowerCaseAdminAddresses = useMemo(
    () => admins.map((adminAddress) => adminAddress.toLowerCase()),
    [admins]
  )

  return (
    <>
      <HStack spacing={5}>
        <Text colorScheme="gray">
          There are currently {admins.length ?? 0} admin addresses.
        </Text>
        <Button
          px={0}
          variant="ghost"
          fontWeight="medium"
          fontSize="sm"
          h="10"
          w="min"
          rightIcon={<ArrowSquareOut />}
          iconSpacing="3"
          _hover={{ bgColor: null }}
          _active={{ bgColor: null }}
          onClick={onOpen}
        >
          {admins.length > 0 ? "Edit list" : "Add some"}
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={closeModal} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="xl">
          <ModalHeader>Admin addresses</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl w="full" isInvalid={!!form.formState.errors.adminInput}>
              <InputGroup size="md">
                <Input
                  size="md"
                  pr="4.5rem"
                  textOverflow="ellipsis"
                  placeholder="Add a new address"
                  {...form.register("adminInput", {
                    pattern: {
                      value: /^0x[0-9a-f]{40}$/i,
                      message: "Has to be a valid address",
                    },
                    validate: (value) =>
                      !lowerCaseAdminAddresses.includes(value.toLowerCase()) ||
                      "This address is already added",
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    isDisabled={adminInput?.length <= 0}
                    h="1.75rem"
                    size="sm"
                    onClick={form.handleSubmit((value) =>
                      setValue("admins", [...admins, value.adminInput])
                    )}
                  >
                    Add
                  </Button>
                </InputRightElement>
              </InputGroup>

              <FormErrorMessage>
                {form.formState.errors.adminInput?.message}
              </FormErrorMessage>
            </FormControl>

            {memberOptions?.length > 0 && (
              <>
                <Center my={2}>
                  <Text color="gray" fontWeight="semibold" fontSize="xs">
                    OR
                  </Text>
                </Center>

                <Controller
                  control={control}
                  name="admins"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <StyledSelect
                      placeholder="Select from members"
                      ref={ref}
                      options={memberOptions}
                      value=""
                      onChange={(selectedOption: SelectOption) => {
                        onChange([...admins, selectedOption?.value])
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </>
            )}

            <Center>
              <Divider my={5} w="sm" />
            </Center>

            <Center w="full" overflowY="auto">
              <UnorderedList w="min" maxH="300px" m={0}>
                {admins?.length ? (
                  admins.map((address) => (
                    <Box key={address}>
                      <Tag
                        size="lg"
                        borderRadius="full"
                        variant="solid"
                        colorScheme="gray"
                        my={2}
                        w="full"
                        justifyContent="space-between"
                      >
                        <TagLabel>
                          {addressShorten > 0
                            ? shortenHex(address, addressShorten)
                            : address}
                        </TagLabel>
                        <TagCloseButton
                          onClick={() =>
                            setValue(
                              "admins",
                              admins.filter(
                                (adminAddress) => adminAddress !== address
                              )
                            )
                          }
                        />
                      </Tag>
                    </Box>
                  ))
                ) : (
                  <Text colorScheme={"gray"} whiteSpace="nowrap">
                    {admins.length <= 0 ? "No admin addresses" : "No results"}
                  </Text>
                )}
              </UnorderedList>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Admins
