import { Box, Collapse, useColorModeValue, VStack } from "@chakra-ui/react"
import React, { useState } from "react"
import { Logic, Requirement } from "types"
import LogicDivider from "../LogicDivider"
import AllowlistRequirementCard from "./components/AllowlistRequirementCard"
import ExpandRequirementsButton from "./components/ExpandRequirementsButton"
import FreeRequirementCard from "./components/FreeRequirementCard"
import GalaxyRequirementCard from "./components/GalaxyRequirementCard"
import JuiceboxRequirementCard from "./components/JuiceboxRequirementCard"
import MirrorRequirementCard from "./components/MirrorRequirementCard"
import NftRequirementCard from "./components/NftRequirementCard"
import PoapRequirementCard from "./components/PoapRequirementCard"
import SnapshotRequirementCard from "./components/SnapshotRequirementCard"
import TokenRequirementCard from "./components/TokenRequirementCard"
import UnlockRequirementCard from "./components/UnlockRequirementCard"

const REQUIREMENT_CARDS = {
  FREE: FreeRequirementCard,
  ERC20: TokenRequirementCard,
  COIN: TokenRequirementCard,
  ERC721: NftRequirementCard,
  ERC1155: NftRequirementCard,
  UNLOCK: UnlockRequirementCard,
  POAP: PoapRequirementCard,
  MIRROR: MirrorRequirementCard,
  SNAPSHOT: SnapshotRequirementCard,
  ALLOWLIST: AllowlistRequirementCard,
  JUICEBOX: JuiceboxRequirementCard,
  GALAXY: GalaxyRequirementCard,
}

type Props = {
  requirements: Requirement[]
  logic: Logic
}

const Requirements = ({ requirements, logic }: Props) => {
  const sliceIndex = (requirements?.length ?? 0) - 3
  const shownRequirements = (requirements ?? []).slice(0, 3)
  const hiddenRequirements =
    sliceIndex > 0 ? (requirements ?? []).slice(-sliceIndex) : []

  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false)
  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-900)"
  )

  return (
    <VStack spacing="0">
      {shownRequirements.map((requirement, i) => {
        const RequirementCard = REQUIREMENT_CARDS[requirement.type]

        if (RequirementCard)
          return (
            <React.Fragment key={i}>
              <RequirementCard requirement={requirement} />
              {i < shownRequirements.length - 1 && <LogicDivider logic={logic} />}
            </React.Fragment>
          )
      })}

      <Collapse
        in={isRequirementsExpanded}
        animateOpacity={false}
        style={{ width: "100%" }}
      >
        {hiddenRequirements.map((requirement, i) => {
          const RequirementCard = REQUIREMENT_CARDS[requirement.type]
          if (RequirementCard)
            return (
              <React.Fragment key={i}>
                {i === 0 && <LogicDivider logic={logic} />}
                <RequirementCard requirement={requirement} />
                {i < hiddenRequirements.length - 1 && <LogicDivider logic={logic} />}
              </React.Fragment>
            )
        })}
      </Collapse>

      {hiddenRequirements.length > 0 && (
        <>
          <ExpandRequirementsButton
            logic={logic}
            hiddenRequirements={hiddenRequirements.length}
            isRequirementsExpanded={isRequirementsExpanded}
            setIsRequirementsExpanded={setIsRequirementsExpanded}
          />
          <Box
            position="absolute"
            bottom={{ base: 8, md: 0 }}
            left={0}
            right={0}
            height={6}
            bgGradient={`linear-gradient(to top, ${shadowColor}, transparent)`}
            pointerEvents="none"
            opacity={isRequirementsExpanded ? 0 : 0.6}
            transition="opacity 0.2s ease"
          />
        </>
      )}
    </VStack>
  )
}

export default Requirements
