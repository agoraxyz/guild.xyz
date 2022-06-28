import { HStack, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import JoinButton from "components/[guild]/RolesByPlatform/components/JoinButton"
import { PropsWithChildren } from "react"
import { PlatformName } from "types"
import Platform from "./components/Platform"

type Props = {
  platformId: number
  platformType: PlatformName
  platformName: string
}

const RolesByPlatform = ({
  platformId,
  platformType,
  platformName,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Card width="full">
      <HStack
        px={{ base: 4, sm: 6 }}
        py={{ base: 3, sm: 4 }}
        justifyContent={platformType?.length > 0 ? "space-between" : "end"}
        bgColor={colorMode === "light" ? "white" : "blackAlpha.300"}
        borderBottomWidth={colorMode === "light" ? 1 : 0}
        borderBottomColor={colorMode === "light" ? "gray.200" : undefined}
      >
        {platformType?.length > 0 && (
          <Platform
            id={platformId}
            type={platformType as PlatformName}
            name={platformName}
          />
        )}
        <JoinButton platform={platformType} />
      </HStack>

      {children}
    </Card>
  )
}

export default RolesByPlatform
