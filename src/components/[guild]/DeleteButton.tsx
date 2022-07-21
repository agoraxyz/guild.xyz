import { ButtonProps, Icon, IconButton, Tooltip } from "@chakra-ui/react"
import { Trash } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  label: string
  onClick: () => void
} & ButtonProps

const DeleteButton = ({ label, onClick }: PropsWithChildren<Props>): JSX.Element => (
  <Tooltip label={label}>
    <IconButton
      aria-label={label}
      icon={<Icon as={Trash} boxSize="1.1em" weight="bold" />}
      colorScheme="red"
      variant={"ghost"}
      borderRadius={"full"}
      maxW={10}
      maxH={10}
      onClick={onClick}
    />
  </Tooltip>
)

export default DeleteButton
