import Color from "color"
import ColorThief from "colorthief/dist/color-thief.mjs"
import { Uploader } from "hooks/usePinata/usePinata"
import { useEffect } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"

const useSetImageAndNameFromPlatformData = (
  platformImage: string,
  platformName: string,
  onUpload?: Uploader["onUpload"]
) => {
  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  useEffect(() => {
    if (!(platformName?.length > 0) || !!touchedFields.name || !onUpload) return

    setValue("name", platformName)
  }, [platformName])

  useEffect(() => {
    if (!onUpload) return
    if (!(platformImage?.length > 0) || !!touchedFields.imageUrl) {
      setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
      return
    }

    setValue("imageUrl", platformImage)
    ;(async () => setValue("theme.color", await getColorByImage(platformImage)))()

    fetch(platformImage)
      .then((response) => response.blob())
      .then((blob) =>
        onUpload({
          data: [new File([blob], `${platformName}.png`, { type: "image/png" })],
        })
      )
  }, [platformImage])
}

const getColorByImage = (imageUrl) =>
  new Promise((resolve, reject) => {
    const colorThief = new ColorThief()

    const imgEl = document.createElement("img")
    imgEl.src = imageUrl
    imgEl.width = 64
    imgEl.height = 64
    imgEl.crossOrigin = "anonymous"

    imgEl.addEventListener("load", () => {
      const dominantRgbColor = colorThief.getColor(imgEl)
      const dominantHexColor = Color.rgb(dominantRgbColor).hex()
      resolve(dominantHexColor)
    })
  })

export default useSetImageAndNameFromPlatformData
