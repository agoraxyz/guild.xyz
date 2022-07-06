import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import { AnimatePresence, LayoutGroup } from "framer-motion"
import { useMemo } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { GuildFormType, Requirement, RequirementType } from "types"
import LogicPicker from "../LogicPicker"
import AddRequirementCard from "./components/AddRequirementCard"
import AllowlistFormCard from "./components/AllowlistFormCard"
import BalancyCounter from "./components/BalancyCounter"
import FormCard from "./components/FormCard"
import GalaxyFormCard from "./components/GalaxyFormCard"
import JuiceboxFormCard from "./components/JuiceboxFormCard"
import MirrorFormCard from "./components/MirrorFormCard"
import NftFormCard from "./components/NftFormCard"
import PoapFormCard from "./components/PoapFormCard"
import SnapshotFormCard from "./components/SnapshotFormCard"
import TokenFormCard from "./components/TokenFormCard"
import UnlockFormCard from "./components/UnlockFormCard"
import useAddRequirementsFromQuery from "./hooks/useAddRequirementsFromQuery"

const REQUIREMENT_FORMCARDS = {
  ERC20: TokenFormCard,
  COIN: TokenFormCard,
  POAP: PoapFormCard,
  MIRROR: MirrorFormCard,
  SNAPSHOT: SnapshotFormCard,
  ALLOWLIST: AllowlistFormCard,
  ERC721: NftFormCard,
  ERC1155: NftFormCard,
  JUICEBOX: JuiceboxFormCard,
  UNLOCK: UnlockFormCard,
  GALAXY: GalaxyFormCard,
}

type Props = {
  maxCols?: number
}

const SetRequirements = ({ maxCols = 2 }: Props): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const { control, getValues, setValue, watch, clearErrors } =
    useFormContext<GuildFormType>()

  /**
   * TODO: UseFieldArrays's remove function doesn't work correctly with
   * AnimatePresence for some reason, so as workaround we don't remove fields, just
   * set their type to `null` and filter them out at submit
   */
  const { fields, append, replace } = useFieldArray({
    name: "requirements",
    control,
  })

  useAddRequirementsFromQuery(append)

  const addRequirement = (type: RequirementType) => {
    append({
      type,
      address: null,
      data: {},
    })

    // Sending actions to datadog
    addDatadogAction("Added a requirement")
    addDatadogAction(`Added a requirement [${type}]`)
  }

  const removeRequirement = (index: number) => {
    setValue(`requirements.${index}.type`, null)
    clearErrors(`requirements.${index}`)
  }

  // Watching the nested fields too, so we can properly update the list
  const watchFieldArray = watch("requirements")
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }))

  const freeEntry = useMemo(
    () => !!controlledFields?.find((requirement) => requirement.type === "FREE"),
    [controlledFields]
  )

  const onFreeEntryChange = (e) =>
    e.target.checked
      ? replace([{ type: "FREE", data: {}, chain: null, address: null }])
      : replace([])

  const isMobile = useBreakpointValue({ base: true, sm: false })

  return (
    <>
      <LogicPicker />
      <FormControl>
        <HStack mb={2}>
          <FormLabel m="0" htmlFor="-">
            Requirements
          </FormLabel>
          <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
            {`- or `}
          </Text>
          <Checkbox
            flexGrow={0}
            fontWeight="normal"
            size="sm"
            spacing={1}
            defaultChecked={freeEntry}
            onChange={onFreeEntryChange}
          >
            Free entry
          </Checkbox>
          {!freeEntry && !isMobile && <BalancyCounter ml="auto !important" />}
        </HStack>

        {!freeEntry && isMobile && <BalancyCounter />}
        <LayoutGroup>
          <SimpleGrid
            opacity={freeEntry ? 0.5 : 1}
            columns={{ base: 1, md: 2, lg: maxCols }}
            spacing={{ base: 5, md: 6 }}
            h="full"
          >
            <AnimatePresence>
              {controlledFields.map((field: Requirement, i) => {
                const type: RequirementType = getValues(`requirements.${i}.type`)
                const RequirementFormCard = REQUIREMENT_FORMCARDS[type]

                if (RequirementFormCard) {
                  return (
                    <FormCard
                      index={i}
                      type={type}
                      onRemove={() => removeRequirement(i)}
                      key={field.id}
                    >
                      <RequirementFormCard field={field} index={i} />
                    </FormCard>
                  )
                }
              })}
            </AnimatePresence>

            <AddRequirementCard
              initial={!controlledFields?.find((field) => !!field.type)}
              onAdd={addRequirement}
            />

            <Box
              display={freeEntry ? "block" : "none"}
              position="absolute"
              inset={0}
              bgColor="transparent"
            />
          </SimpleGrid>
        </LayoutGroup>
      </FormControl>
    </>
  )
}

export default SetRequirements
