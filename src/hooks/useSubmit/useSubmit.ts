import { useMachine } from "@xstate/react"
import usePersonalSign from "hooks/usePersonalSign"
import createFetchMachine from "./utils/fetchMachine"

type Options<ResponseType> = {
  onSuccess?: (response: ResponseType) => void
  onError?: (error: any) => void
}

const useSubmit = <DataType, ResponseType>(
  fetch: (data: DataType) => Promise<ResponseType>,
  { onSuccess, onError }: Options<ResponseType> = {}
) => {
  const [state, send] = useMachine(createFetchMachine<DataType, ResponseType>(), {
    services: {
      fetch: (_context, event) => {
        // needed for typescript to ensure that event always has data property
        if (event.type !== "FETCH") return
        return fetch(event.data)
      },
    },
    actions: {
      onSuccess: (context) => {
        onSuccess?.(context.response)
      },
      onError: async (context) => {
        const err = await context.error
        onError?.(err)
      },
    },
  })

  return {
    ...state.context,
    onSubmit: (data?: DataType) => send({ type: "FETCH", data }),
    isLoading: state.matches("fetching"),
  }
}

const useSubmitWithSign = <DataType, ResponseType>(
  fetch: (data: DataType) => Promise<ResponseType>,
  options: Options<ResponseType> = {}
) => {
  const { callbackWithSign } = usePersonalSign(true)
  const obj = useSubmit(fetch, options)
  return {
    ...obj,
    onSubmit: (data?: DataType) => callbackWithSign(() => obj.onSubmit(data))(),
  }
}

export default useSubmit
export { useSubmitWithSign }
