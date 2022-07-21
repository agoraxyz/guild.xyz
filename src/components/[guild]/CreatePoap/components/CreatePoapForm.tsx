import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Img,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useGuild from "components/[guild]/hooks/useGuild"
import { AnimatePresence, motion } from "framer-motion"
import useDropzone from "hooks/useDropzone"
import {
  ArrowRight,
  Calendar,
  File,
  Plus,
  Question,
  WarningCircle,
} from "phosphor-react"
import { useEffect, useState } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
import { CreatePoapForm as CreatePoapFormType, PlatformType } from "types"
import getRandomInt from "utils/getRandomInt"
import useCreatePoap from "../hooks/useCreatePoap"
import useSavePoap from "../hooks/useSavePoap"
import { useCreatePoapContext } from "./CreatePoapContext"

const MotionBox = motion(Box)

const CreatePoapForm = (): JSX.Element => {
  const { nextStep } = useCreatePoapContext()
  const { colorMode } = useColorMode()

  const methods = useForm<CreatePoapFormType>({
    mode: "all",
    defaultValues: {
      secret_code: Math.floor(100000 + Math.random() * 900000),
      event_template_id: 0,
      virtual_event: true,
      private_event: false,
      city: "",
      country: "",
    },
  })

  const {
    control,
    register,
    setValue,
    resetField,
    formState: { errors },
    handleSubmit,
  } = methods

  const { id, guildPlatforms } = useGuild()

  const startDate = useWatch({ control, name: "start_date" })
  const endDate = useWatch({ control, name: "end_date" })
  const expiryDate = useWatch({ control, name: "expiry_date" })

  useEffect(() => {
    if (!register) return
    register("image", { required: "This field is required." })
  }, [register])

  const { data: eventTemplatesData, isValidating: eventTemplatesLoading } =
    useSWRImmutable("https://api.poap.tech/event-templates?limit=1000")

  const [multiDay, setMultiDay] = useState(false)

  const { poapData, setPoapData } = useCreatePoapContext()
  const {
    onSubmit: onCreatePoapSubmit,
    isLoading: isCreatePoapLoading,
    response: createPoapResponse,
  } = useCreatePoap()
  const {
    onSubmit: onSavePoapSubmit,
    isLoading: isSavePoapLoading,
    response: savePoapResponse,
  } = useSavePoap()

  const onSubmit = (data: CreatePoapFormType) => {
    setPoapData(data)
    onCreatePoapSubmit(data)
  }

  useEffect(() => {
    if (!createPoapResponse) return
    setPoapData({ ...(poapData || {}), ...createPoapResponse })
    onSavePoapSubmit({
      poapId: createPoapResponse?.id,
      fancyId: createPoapResponse?.fancy_id,
      expiryDate: createPoapResponse?.expiry_date
        ? parseInt(
            (new Date(createPoapResponse.expiry_date).getTime() / 1000).toString()
          )
        : undefined,
      guildId: id,
    })
  }, [createPoapResponse])

  useEffect(() => {
    if (multiDay) return
    resetField("end_date")
  }, [multiDay])

  const {
    isDragActive,
    fileRejections,
    getRootProps,
    getInputProps,
    acceptedFiles,
  } = useDropzone({
    multiple: false,
    accept: "image/png",
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setValue("image", accepted[0])
      }
    },
  })

  const {
    onSubmit: onCreateRoleSubmit,
    isLoading: isCreateRoleLoading,
    response: createRoleResponse,
  } = useCreateRole("SIMPLE")

  const createRoleWithPoap = () =>
    onCreateRoleSubmit({
      guildId: id,
      rolePlatforms: [
        {
          guildPlatformId: guildPlatforms?.find(
            (p) => p.platformId === PlatformType.DISCORD
          )?.id,
          platformRoleData: {},
          platformRoleId: null,
        },
      ],
      logic: "AND",
      name: "POAP owner",
      description: `A role for ${poapData?.name ?? "POAP"} owners`,
      imageUrl: poapData?.image_url ?? `/guildLogos/${getRandomInt(286)}.svg`,
      requirements: [
        {
          type: "POAP",
          data: {
            id: poapData?.fancy_id,
          },
        },
      ],
    })

  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      <MotionBox key={savePoapResponse ? "success" : "create-poap-form"}>
        {savePoapResponse ? (
          <VStack pb={8} spacing={6} textAlign="center">
            <Text fontSize="3xl" fontFamily="display" fontWeight="bold">
              Hooray!
              <br />
              You've created a new drop
            </Text>
            <Text maxW="md">
              You requested{" "}
              <Skeleton isLoaded={!!poapData} display="inline">
                {poapData?.requested_codes || "unknown"}
              </Skeleton>{" "}
              mint links for your drop. The POAP Curation Body will review your
              petition according to the POAP drop policies and you'll receive a
              confirmation email after it is reviewed.
            </Text>

            <Stack
              p={4}
              bgColor={colorMode === "light" ? "gray.200" : "blackAlpha.300"}
              borderRadius="2xl"
              direction="row"
              alignItems="center"
              spacing={4}
            >
              <SkeletonCircle boxSize={24} isLoaded={!!poapData?.image}>
                <Img
                  src={poapData?.image_url}
                  alt={poapData?.name}
                  boxSize={24}
                  rounded="full"
                />
              </SkeletonCircle>
              <VStack alignItems="start">
                <Skeleton isLoaded={!!poapData}>
                  <Text fontFamily="display" fontWeight="bold">
                    {poapData
                      ? `#${poapData?.id} - ${poapData?.name}`
                      : "#0 - Unknown POAP"}
                  </Text>
                </Skeleton>

                <Skeleton isLoaded={!!poapData}>
                  <HStack>
                    <Icon as={Calendar} />
                    <Text>{poapData?.start_date || "Unknown date"}</Text>
                  </HStack>
                </Skeleton>
              </VStack>
            </Stack>

            <Stack direction={{ base: "column", md: "row" }}>
              <Button
                isDisabled={!poapData || createRoleResponse}
                leftIcon={<Icon as={Plus} />}
                onClick={createRoleWithPoap}
                isLoading={isCreateRoleLoading}
                loadingText="Creating role"
              >
                Create role for POAP owners
              </Button>

              <Button
                colorScheme="indigo"
                isDisabled={!poapData}
                onClick={nextStep}
                rightIcon={<Icon as={ArrowRight} />}
              >
                Upload mint links
              </Button>
            </Stack>
          </VStack>
        ) : (
          <FormProvider {...methods}>
            <Grid mb={12} templateColumns="repeat(2, 1fr)" rowGap={6} columnGap={4}>
              <GridItem colSpan={2}>
                <FormControl isRequired isInvalid={!!errors?.name}>
                  <FormLabel>What are you commemorating?</FormLabel>
                  <Input
                    {...register("name", { required: "This field is required." })}
                  />
                  <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl isRequired isInvalid={!!errors?.description}>
                  <FormLabel>
                    What do you want people to remember about this drop?
                  </FormLabel>
                  <Textarea
                    {...register("description", {
                      required: "This field is required.",
                    })}
                    className="custom-scrollbar"
                    minH={32}
                    placeholder="Explain what this POAP is about, including how the POAP will be distributed. This text is stored on the NFT metadata and displayed in the POAP mobile app and all across the POAP ecosystem. Drops in languages other than English still have to provide an English description."
                  />
                  <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <Checkbox onChange={(e) => setMultiDay(e?.target?.checked)}>
                  Multi-day Drop
                </Checkbox>
              </GridItem>

              <GridItem colSpan={2}>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <FormControl isInvalid={!!errors?.start_date} isRequired>
                    <FormLabel>Start date:</FormLabel>
                    <Input
                      type="date"
                      max={endDate}
                      {...register("start_date", {
                        required: "This field is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors?.start_date?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isDisabled={!multiDay || !startDate}
                    isInvalid={!!errors?.end_date}
                    isRequired={multiDay}
                  >
                    <FormLabel>End date:</FormLabel>
                    <Input
                      type="date"
                      min={startDate}
                      max={expiryDate}
                      {...register("end_date", {
                        required: multiDay && "This field is required",
                      })}
                    />
                    <FormErrorMessage>{errors?.end_date?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isDisabled={!startDate || (multiDay && !endDate)}
                    isInvalid={!!errors?.expiry_date}
                    isRequired
                  >
                    <FormLabel>Expiry date:</FormLabel>
                    <Input
                      type="date"
                      min={endDate || startDate}
                      {...register("expiry_date", {
                        required: "This field is required",
                        validate: (value) =>
                          value !== (endDate || startDate) ||
                          "Shouldn't be the same as end date.",
                      })}
                    />
                    <FormErrorMessage>
                      {errors?.expiry_date?.message}
                    </FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <FormLabel>Website</FormLabel>
                  <Input {...register("event_url")} />
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <FormLabel>Template</FormLabel>
                  <Select
                    disabled={eventTemplatesLoading || !eventTemplatesData}
                    {...register("event_template_id")}
                  >
                    <option value={0}>Standard template</option>
                    {eventTemplatesData?.event_templates?.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl
                  textAlign="left"
                  isInvalid={!!errors?.image || !!fileRejections?.[0]}
                  isRequired
                >
                  <HStack alignItems="start" spacing={0}>
                    <FormLabel>POAP artwork</FormLabel>
                    <Tooltip
                      label="You can't edit image after POAP creation!"
                      shouldWrapChildren
                    >
                      <Icon
                        as={WarningCircle}
                        position="relative"
                        top={0.5}
                        left={-2}
                      />
                    </Tooltip>
                  </HStack>
                  <Button
                    {...getRootProps()}
                    as="label"
                    leftIcon={<File />}
                    h={10}
                    w="full"
                    maxW={56}
                  >
                    <input {...getInputProps()} hidden />
                    <Text as="span" display="block" maxW={44} isTruncated>
                      {isDragActive
                        ? "Drop the file here"
                        : acceptedFiles?.[0]?.name || "Choose image"}
                    </Text>
                  </Button>
                  <FormHelperText>In PNG format</FormHelperText>
                  <FormErrorMessage>
                    {errors?.image?.message ||
                      fileRejections?.[0]?.errors?.[0]?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isInvalid={!!errors?.secret_code} isRequired>
                  <HStack alignItems="start" spacing={0}>
                    <FormLabel>Edit code</FormLabel>
                    <Tooltip
                      label="Be sure to save the 6 digit Edit Code to make any further updates"
                      shouldWrapChildren
                    >
                      <Icon as={Question} position="relative" top={0.5} left={-2} />
                    </Tooltip>
                  </HStack>
                  <Input
                    {...register("secret_code", {
                      required: "This field is required.",
                    })}
                  />
                  <FormErrorMessage>{errors?.secret_code?.message}</FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isInvalid={!!errors?.email} isRequired>
                  <FormLabel>Your e-mail address:</FormLabel>
                  <Input
                    {...register("email", { required: "This field is required." })}
                  />
                  <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isInvalid={!!errors?.requested_codes} isRequired>
                  <HStack alignItems="start" spacing={0}>
                    <FormLabel>How many mint links do you need?</FormLabel>
                    <Tooltip
                      label="
              Request the amount of codes you will need for this drop"
                      shouldWrapChildren
                    >
                      <Icon as={Question} position="relative" top={0.5} left={-2} />
                    </Tooltip>
                  </HStack>

                  <Controller
                    name="requested_codes"
                    control={control}
                    defaultValue={0}
                    rules={{
                      required: "This field is required.",
                      min: {
                        value: 0,
                        message: "Must be positive",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <NumberInput
                        ref={ref}
                        value={value ?? undefined}
                        defaultValue={0}
                        onChange={onChange}
                        onBlur={onBlur}
                        min={0}
                      >
                        <NumberInputField placeholder="Mint links" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />

                  <FormErrorMessage>
                    {errors?.requested_codes?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl textAlign="left">
                  <FormLabel>Drop type</FormLabel>
                  <Controller
                    name="private_event"
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Checkbox
                        ref={ref}
                        onChange={(e) => onChange(e?.target?.checked)}
                        onBlur={onBlur}
                        checked={value}
                      >
                        Private drop
                      </Checkbox>
                    )}
                  />
                  <FormHelperText>
                    If this is a test drop, please make your drop private.
                  </FormHelperText>
                </FormControl>
              </GridItem>
            </Grid>
            <Flex justifyContent="end">
              <Button
                colorScheme="indigo"
                onClick={handleSubmit(onSubmit, console.log)}
                isDisabled={isCreatePoapLoading || isSavePoapLoading}
                isLoading={isCreatePoapLoading || isSavePoapLoading}
              >
                Create POAP
              </Button>
            </Flex>

            <DynamicDevTool control={control} />
          </FormProvider>
        )}
      </MotionBox>
    </AnimatePresence>
  )
}

export default CreatePoapForm
