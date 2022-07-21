import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useSWR from "swr"

const useDiscordRoleMemberCounts = (roleIds?: string[]) => {
  const { guildPlatform } = useRolePlatform()

  const shouldFetch =
    guildPlatform.platformGuildId?.length > 0 && Array.isArray(roleIds)

  const { isValidating, data, error } = useSWR(
    shouldFetch
      ? [
          `/discord/memberCount/${guildPlatform.platformGuildId}`,
          { method: "POST", body: { roleIds } },
        ]
      : null
  )

  return {
    memberCounts: data,
    error,
    isLoading: isValidating,
  }
}

export default useDiscordRoleMemberCounts
