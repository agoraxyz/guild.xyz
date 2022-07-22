import { Contract } from "@ethersproject/contracts"
import { hashMessage } from "@ethersproject/hash"

import { JsonRpcProvider } from "@ethersproject/providers"
import { Chains, RPC } from "connectors"
// import EIP1271_ABI from "static/abis/EIP1271.json"
import GNOSIS_SAFE_L2_ABI from "static/abis/gnosisSafeL2.json"
import GNOSIS_SIGN_MESSAGE_LIB_ABI from "static/abis/gnosisSignMessageLib.json"

// const EIP1271_VALID_SIGNATURE_VALUE = "0x1626ba7e"

// Move this type elsewhere, if we add multiple callbacks like this
export type MethodSignCallback = (
  message: string,
  address: string,
  chainId: number
) => Promise<void>

const gnosisSafeSignCallback: MethodSignCallback = async (
  message: string,
  address: string,
  chainId: number
) => {
  try {
    const rpcProvider = new JsonRpcProvider(RPC[Chains[chainId]].rpcUrls[0])
    /**
     * Calling using sign lib abi here instead of the safe's, because the call gets
     * forwarded to the lib by the safe contract. This seems to be the only way, we
     * can call getMessageHash.
     */
    const signLibContract = new Contract(
      address,
      GNOSIS_SIGN_MESSAGE_LIB_ABI,
      rpcProvider
    )
    const safeContract = new Contract(address, GNOSIS_SAFE_L2_ABI, rpcProvider)
    const msgHash = await signLibContract.getMessageHash(hashMessage(message))

    /** This message gets emitted when the sign transaction is finalized, we must await it here */
    await new Promise<void>((resolve) =>
      safeContract.once(safeContract.filters.SignMsg(msgHash), resolve)
    )

    // const safeContractForEIP1271 = new Contract(address, EIP1271_ABI, provider)
    // const result = await safeContractForEIP1271.isValidSignature(
    //   hashMessage(message),
    //   "0x"
    // )

    // console.log("isValidSignature result:", result === EIP1271_VALID_SIGNATURE_VALUE)
  } catch (error) {
    console.error("Gnosis Safe signature error:", error)
  }
}

export default gnosisSafeSignCallback
