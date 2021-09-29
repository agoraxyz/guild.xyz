import { InputGroup, InputLeftAddon } from "@chakra-ui/input"
import { Select } from "@chakra-ui/select"
import { Dispatch, useEffect, useState } from "react"
import { Guild } from "temporaryData/types"

const ordering = {
  name: (a: Guild, b: Guild) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  },
  oldest: (a: Guild, b: Guild) => a.id - b.id,
  newest: (a: Guild, b: Guild) => b.id - a.id,
  // "least members": (a: Guild, b: Guild) =>
  //   a.levels[0].membersCount - b.levels[0].membersCount,
  // "most members": (a: Guild, b: Guild) =>
  //   b.levels[0].membersCount - a.levels[0].membersCount,
}

// const orderGuilds = (_, guilds, order) => [...guilds].sort(ordering[order])

type Props = {
  guilds: Guild[]
  setOrderedGuilds: Dispatch<Guild[]>
}

const OrderSelect = ({ guilds, setOrderedGuilds }: Props) => {
  const [order, setOrder] = useState("newest")

  useEffect(() => {
    // using spread to create a new object so React triggers an update
    setOrderedGuilds([...guilds].sort(ordering[order]))
  }, [guilds, order])

  /**
   * We could use SWR to spare recalculating the sorted arrays, but with the number
   * of guilds we have now I haven't noticed any relevant performance gain even at 6x
   * slowdown, so it's better to save memory instead
   */
  // const { data } = useSWR(["order", guilds, order], orderGuilds, {
  //   dedupingInterval: 9000000,
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  // })

  // useEffect(() => {
  //   if (data) setOrderedGuilds(data)
  // }, [data])

  return (
    <InputGroup size="lg" maxW="300px">
      <InputLeftAddon bg="gray.700">Order by</InputLeftAddon>
      <Select
        borderLeftRadius="0"
        onChange={(e) => setOrder(e.target.value)}
        value={order}
      >
        {Object.keys(ordering).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </InputGroup>
  )
}

export default OrderSelect
