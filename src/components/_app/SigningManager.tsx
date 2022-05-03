import { useWeb3React } from "@web3-react/core"
import { createContext, PropsWithChildren, useContext, useState } from "react"

const SigningManagerContext = createContext<{
  isSigning: boolean
  sign: (messageToSign: string) => Promise<string>
}>({
  isSigning: false,
  sign: () => null,
})

const SigningManager = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const { account, library } = useWeb3React()
  const [isSigning, setIsSigning] = useState(false)

  const sign = async (messageToSign: string) => {
    setIsSigning(true)
    const addressSignedMessage = await library
      .getSigner(account?.toLowerCase())
      .signMessage(messageToSign)
      .finally(() => setIsSigning(false))
    return addressSignedMessage
  }

  return (
    <SigningManagerContext.Provider
      value={{
        isSigning,
        sign,
      }}
    >
      {children}
    </SigningManagerContext.Provider>
  )
}

const useSigningManager = () => useContext(SigningManagerContext)

export { SigningManager, useSigningManager }
