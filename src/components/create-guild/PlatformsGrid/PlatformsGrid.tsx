import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import OptionCard from "components/common/OptionCard"
import { CaretRight } from "phosphor-react"
import { PlatformName } from "types"
import DiscordSelectButton from "./components/DiscordSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
  columns?: SimpleGridProps["columns"]
}

const platforms: Partial<
  Record<
    PlatformName,
    {
      description: string
      label: string
      Btn?: (props: { onSelection: Props["onSelection"] }) => JSX.Element
    }
  >
> = {
  DISCORD: {
    description: "Manage roles & guard server",
    label: "Discord",
    Btn: DiscordSelectButton,
  },
  TELEGRAM: {
    description: "Token gate your group",
    label: "Telegram",
  },
}

const PlatformsGrid = ({ onSelection, columns = { base: 1, md: 2 } }: Props) => (
  <SimpleGrid columns={columns} gap={{ base: 4, md: 6 }}>
    {Object.entries(platforms).map(([platformName, { description, Btn, label }]) => (
      <OptionCard
        key={platformName}
        size="lg"
        title={label}
        image={`/platforms/${platformName.toLowerCase()}.png`}
        bgImage={`/platforms/${platformName.toLowerCase()}_bg.png`}
        description={description}
      >
        {(Btn && <Btn onSelection={onSelection} />) || (
          <Button
            colorScheme="TELEGRAM"
            rightIcon={<CaretRight />}
            onClick={() => onSelection("TELEGRAM")}
          >
            Next
          </Button>
        )}
      </OptionCard>
    ))}
  </SimpleGrid>
)

export { platforms }
export default PlatformsGrid
