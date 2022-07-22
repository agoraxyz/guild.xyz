import useKeyPair from "hooks/useKeyPair"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { Guild } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import useUser from "./useUser"

const useGuild = (guildId?: string | number) => {
  const router = useRouter()

  const { addresses } = useUser()

  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  const id = guildId ?? router.query.guild

  const { ready, keyPair } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const swrKey =
    ready && keyPair && isAdmin
      ? [`/guild/details/${id}`, { method: "POST", body: {} }]
      : `/guild/${id}`

  const fetcherFunction = ready && keyPair ? fetcherWithSign : fetcher

  const { data, isValidating } = useSWR<Guild>(id ? swrKey : null, fetcherFunction)

  useEffect(() => {
    if (!data || !addresses) return
    setIsAdmin(
      !!data.admins?.some((admin) => admin.address === addresses[0].toLowerCase())
    )
  }, [data, addresses])

  return {
    ...data,
    isLoading: !data && isValidating,
  }
}

export default useGuild
