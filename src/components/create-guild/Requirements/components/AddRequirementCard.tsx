import {
  Button,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { CurrencyCircleDollar, ListChecks, Plus } from "phosphor-react"
import Nft from "static/requirementIcons/nft.svg"
import { RequirementType } from "types"

type Props = {
  onAdd: (type: RequirementType) => void
}

const AddRequirementCard = ({ onAdd }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <CardMotionWrapper>
      <Card>
        <Tabs isFitted variant="unstyled">
          <TabList
            bgColor={colorMode === "light" ? "blackAlpha.200" : "blackAlpha.400"}
          >
            <Tab
              _selected={{
                bgColor: colorMode === "light" ? "white" : "gray.700",
              }}
              pt={3}
              borderTopRadius="2xl"
              fontSize="sm"
              fontWeight="bold"
              textTransform="uppercase"
            >
              General
            </Tab>
            <Tab
              _selected={{
                bgColor: colorMode === "light" ? "white" : "gray.700",
              }}
              pt={3}
              borderTopRadius="2xl"
              fontSize="sm"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Integrations
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack width="full">
                <Button
                  colorScheme="indigo"
                  leftIcon={<Icon as={Plus} boxSize={6} />}
                  rightIcon={<Icon as={CurrencyCircleDollar} boxSize={6} />}
                  onClick={() => onAdd("ERC20")}
                  width="full"
                  justifyContent="space-between"
                >
                  Hold a Token
                </Button>

                <Button
                  colorScheme="green"
                  leftIcon={<Icon as={Plus} boxSize={6} />}
                  rightIcon={<Icon as={Nft} boxSize={6} />}
                  onClick={() => onAdd("ERC721")}
                  width="full"
                  justifyContent="space-between"
                >
                  Hold an NFT
                </Button>

                <Button
                  colorScheme="white"
                  leftIcon={<Icon as={ListChecks} boxSize={6} />}
                  onClick={() => onAdd("WHITELIST")}
                  width="full"
                  justifyContent="space-between"
                >
                  Create whitelist
                </Button>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack width="full">
                <Button
                  colorScheme="blue"
                  onClick={() => onAdd("POAP")}
                  width="full"
                >
                  Hold a POAP
                </Button>

                <Button
                  colorScheme="orange"
                  onClick={() => onAdd("SNAPSHOT")}
                  width="full"
                >
                  Snapshot Strategy
                </Button>

                <Button
                  colorScheme="gray"
                  onClick={() => onAdd("MIRROR")}
                  width="full"
                >
                  Mirror Edition
                </Button>

                <Button
                  colorScheme="salmon"
                  onClick={() => onAdd("UNLOCK")}
                  width="full"
                >
                  Unlock
                </Button>

                <Button
                  colorScheme="yellow"
                  onClick={() => onAdd("JUICEBOX")}
                  width="full"
                >
                  Juicebox
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
    </CardMotionWrapper>
  )
}

export default AddRequirementCard