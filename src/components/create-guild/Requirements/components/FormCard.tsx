import { CloseButton, HStack, Text, VStack } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ColorCard from "components/common/ColorCard"
import { PropsWithChildren } from "react"
import { RequirementType, RequirementTypeColors } from "types"
import useBalancy from "../hooks/useBalancy"
import RequirementChainTypeText from "./RequirementChainTypeText"

type Props = {
  index: number
  type: RequirementType
  onRemove: () => void
}

const FormCard = ({
  type,
  index,
  onRemove,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { holders } = useBalancy(index)

  return (
    <CardMotionWrapper>
      <ColorCard color={RequirementTypeColors[type]}>
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          width={8}
          height={8}
          rounded="full"
          aria-label="Remove requirement"
          zIndex="1"
          onClick={onRemove}
        />
        <VStack spacing={4} alignItems="start" pt={4} h="full">
          {children}
        </VStack>
        <RequirementChainTypeText
          requirementType={type}
          top={"-px"}
          left={"-px"}
          borderTopLeftRadius="2xl"
          borderBottomRightRadius="xl"
        />
        {typeof holders === "number" && (
          <HStack mt={5}>
            <Text color="gray">{`${holders} ${
              holders > 1 ? "addresses" : "address"
            } ${holders > 1 ? "satisfy" : "satisfies"} this requirement`}</Text>
            {/*<Tooltip
              label={`${holders} ${holders > 1 ? "addresses" : "address"} ${
                holders > 1 ? "satisfy" : "satisfies"
              } this requirement`}
            >
              <Info color="gray" />
            </Tooltip>*/}
          </HStack>
        )}
      </ColorCard>
    </CardMotionWrapper>
  )
}

export default FormCard
