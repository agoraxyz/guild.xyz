import { createContext, PropsWithChildren, useContext } from "react"
import { RolePlatform } from "types"

const RolePlatformContext = createContext<RolePlatform>(null)

type Props = {
  rolePlatform: RolePlatform
}

const RolePlatformProvider = ({
  children,
  rolePlatform,
}: PropsWithChildren<Props>) => (
  <RolePlatformContext.Provider value={rolePlatform}>
    {children}
  </RolePlatformContext.Provider>
)

const useRolePlatform = () => useContext(RolePlatformContext)

export { RolePlatformProvider, useRolePlatform }
