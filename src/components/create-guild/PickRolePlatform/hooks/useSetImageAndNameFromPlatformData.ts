import { getRandomInt } from "components/create-guild/IconSelector/IconSelector"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import pinataUpload from "utils/pinataUpload"

const useSetImageAndNameFromPlatformData = (
  platformImage: string,
  platformName: string,
  setUploadPromise: Dispatch<SetStateAction<Promise<void>>>
) => {
  const { setValue } = useFormContext()

  useEffect(() => {
    if (!(platformName?.length > 0)) return

    setValue("name", platformName)
  }, [platformName])

  useEffect(() => {
    if (!(platformImage?.length > 0)) {
      setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
      return
    }

    setValue("imageUrl", platformImage)
    setUploadPromise(
      fetch(platformImage)
        .then((response) => response.blob())
        .then((blob) =>
          pinataUpload({
            data: [new File([blob], `${platformName}.png`, { type: "image/png" })],
          })
            .then(({ IpfsHash }) => {
              setValue(
                "imageUrl",
                `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
              )
            })
            .catch(() => {
              setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
            })
        )
    )
  }, [platformImage])
}

export default useSetImageAndNameFromPlatformData
