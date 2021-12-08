import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { ArrowUp, DotsThreeVertical, Pencil } from "phosphor-react"
import CustomizationButton from "./components/CustomizationButton"

const EditButtonGroup = (): JSX.Element => {
  const router = useRouter()

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Settings"
        minW={12}
        rounded="2xl"
        colorScheme="alpha"
      >
        <Icon width="1.25em" height="1.25em" as={DotsThreeVertical} />
      </MenuButton>
      <MenuList border="none" shadow="md">
        <CustomizationButton />
        <MenuItem
          py="2"
          cursor="pointer"
          onClick={() => router.push(`/${router.query.guild}/edit`)}
          icon={<Pencil />}
        >
          Edit guild
        </MenuItem>
        <MenuItem py="2" cursor="pointer" icon={<ArrowUp />}>
          Upgrade to Guild
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default EditButtonGroup
