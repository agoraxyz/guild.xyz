import { Box, Flex, Icon, IconButton } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { useRouter } from "next/dist/client/router"
import dynamic from "next/dynamic"
import { ArrowLeft } from "phosphor-react"
import NavMenu from "../components/NavMenu"

export type HeaderProps = {
  showBackButton?: boolean
}

const DynamicAccount = dynamic(() => import("../components/Account"), {
  ssr: false,
})

const Header = ({ showBackButton = true }: HeaderProps): JSX.Element => {
  const colorContext = useThemeContext()
  const router: any = useRouter()
  const hasNavigated = router.components && Object.keys(router.components).length > 2

  return (
    <Flex
      position="relative"
      w="full"
      justifyContent="space-between"
      alignItems="center"
      p="2"
      // temporary
      sx={{
        "[aria-label]": {
          color: colorContext?.localThemeMode
            ? colorContext?.textColor === "whiteAlpha.900"
              ? "whiteAlpha.900"
              : "gray.900"
            : undefined,
        },
      }}
    >
      {showBackButton && hasNavigated ? (
        <IconButton
          aria-label="Go back"
          variant="ghost"
          isRound
          h="10"
          icon={<Icon width="1.1em" height="1.1em" as={ArrowLeft} />}
          onClick={() => router.back()}
        />
      ) : (
        <NavMenu />
      )}
      <Box>
        <DynamicAccount />
      </Box>
    </Flex>
  )
}

export default Header
