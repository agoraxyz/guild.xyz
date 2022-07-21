import { useEffect, useState } from "react"
import useDCAuth from "./useDCAuth"

const useDCAuthWithCallback = (scope: string, callback: () => void) => {
  const { authorization, onOpen, ...rest } = useDCAuth(scope)
  const [hasClickedAuth, setHasClickedAuth] = useState(false)

  const handleClick = () => {
    if (authorization) callback()
    else {
      onOpen()
      setHasClickedAuth(true)
    }
  }

  useEffect(() => {
    if (!authorization || !hasClickedAuth) return

    callback()
  }, [authorization, hasClickedAuth])

  return {
    callbackWithDCAuth: handleClick,
    authorization,
    ...rest,
  }
}

export default useDCAuthWithCallback
