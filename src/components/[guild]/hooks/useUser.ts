import { useWeb3React } from "@web3-react/core"
import useKeyPair from "hooks/useKeyPair"
import useSWR from "swr"
import { User } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useUser = () => {
  const { account } = useWeb3React()
  const { keyPair, ready } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const { isValidating, data, mutate } = useSWR<User>(
    account && ready && keyPair
      ? [`/user/details/${account}`, { method: "POST", body: {} }]
      : null,
    fetcherWithSign
  )

  return {
    isLoading: !data && isValidating,
    ...data,
    mutate,
  }
}

export default useUser
