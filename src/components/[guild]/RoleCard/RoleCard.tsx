import {
  Circle,
  Flex,
  Heading,
  HStack,
  Img,
  SimpleGrid,
  Spacer,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import GuildLogo from "components/common/GuildLogo"
import dynamic from "next/dynamic"
import { PlatformType, Role } from "types"
import parseDescription from "utils/parseDescription"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import Requirements from "../Requirements"
import AccessIndicator from "../RolesByPlatform/components/RoleListItem/components/AccessIndicator"
import MemberCount from "./components/MemberCount"

type Props = {
  role: Role
}

const DynamicEditRole = dynamic(
  () => import("../RolesByPlatform/components/RoleListItem/components/EditRole"),
  {
    ssr: false,
  }
)

const RoleCard = ({ role }: Props) => {
  const { guildPlatforms } = useGuild()
  const { isAdmin } = useGuildPermission()

  const guildPlatform = guildPlatforms?.find(
    (platform) => platform.id === role.rolePlatforms?.[0]?.guildPlatformId
  )
  const rolePlatformType = guildPlatform?.platformId
  const rolePlatformName = guildPlatform?.platformGuildName

  const { colorMode } = useColorMode()
  const iconSize = useBreakpointValue({ base: 48, md: 52 })

  return (
    <CardMotionWrapper>
      <Card>
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          <Flex
            direction="column"
            p={5}
            borderRightWidth={{ base: 0, md: 1 }}
            borderRightColor={colorMode === "light" ? "gray.200" : "gray.600"}
          >
            <HStack justifyContent="space-between" mb={6} spacing={4}>
              <HStack spacing={4}>
                <GuildLogo imageUrl={role.imageUrl} size={iconSize} iconSize={12} />
                <Heading as="h3" fontSize="xl" fontFamily="display">
                  {role.name}
                </Heading>
              </HStack>

              <MemberCount memberCount={role.memberCount} />

              {isAdmin && (
                <>
                  <Spacer />
                  <DynamicEditRole roleData={role} />
                </>
              )}
            </HStack>

            {role.description && (
              <Text mb={6} wordBreak="break-word">
                {parseDescription(role.description)}
              </Text>
            )}

            {/* TODO for multiplatform: map role.platforms here */}
            {rolePlatformType && (
              <HStack mt="auto" pt="3">
                <Circle size={6} overflow="hidden">
                  <Img
                    src={
                      rolePlatformType === PlatformType.DISCORD
                        ? "/platforms/discord.jpg"
                        : "/platforms/telegram.png"
                    }
                    alt={
                      rolePlatformType === PlatformType.DISCORD
                        ? "Discord"
                        : "Telegram"
                    }
                    boxSize={6}
                  />
                </Circle>

                <Text as="span">
                  {rolePlatformType === PlatformType.DISCORD &&
                  !role.rolePlatforms?.[0]?.platformRoleData?.isGuarded
                    ? "Role in: "
                    : "Access to: "}
                  <b>{rolePlatformName}</b>
                </Text>
              </HStack>
            )}
          </Flex>

          <Flex
            direction="column"
            p={5}
            pb={{ base: 14, md: 5 }}
            position="relative"
            bgColor={colorMode === "light" ? "gray.50" : "blackAlpha.300"}
          >
            <HStack
              justifyContent="space-between"
              spacing={0}
              mb={{ base: 4, md: 6 }}
            >
              <Text
                as="span"
                mt="1"
                fontSize="xs"
                fontWeight="bold"
                color="gray"
                textTransform="uppercase"
              >
                Requirements to qualify
              </Text>

              <AccessIndicator roleId={role.id} />
            </HStack>

            <Requirements requirements={role.requirements} logic={role.logic} />
          </Flex>
        </SimpleGrid>
      </Card>
    </CardMotionWrapper>
  )
}

export default RoleCard
