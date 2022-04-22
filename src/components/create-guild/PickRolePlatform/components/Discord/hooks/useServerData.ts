import useSWR from "swr"

export type Channel = { id: string; name: string; roles: string[] }

export type Category = {
  id: string
  name: string
  channels: Channel[]
}

type ServerData = {
  serverIcon: string
  membersWithoutRole: number
  serverName: string
  serverId: string
  categories: Category[]
  isAdmin: boolean
}

const fallbackData = {
  serverIcon: null,
  membersWithoutRole: 0,
  serverName: "",
  serverId: "",
  categories: [],
  isAdmin: undefined,
}

const useServerData = (
  serverId: string,
  { authToken, ...swrOptions } = { authToken: undefined }
) => {
  const shouldFetch = serverId?.length >= 0

  const swrKey = authToken
    ? [
        `/discord/server/${serverId}`,
        { method: "POST", body: { discordToken: authToken } },
      ]
    : `/discord/server/${serverId}`

  const { data, isValidating, error } = useSWR<ServerData>(
    shouldFetch ? swrKey : null,
    {
      fallbackData,
      ...swrOptions,
    }
  )

  return { data, isLoading: isValidating, error }
}

export default useServerData
