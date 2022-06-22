import fetcher from "utils/fetcher"

export default async function handler(req, res) {
  const address = req.query.address
  if (!address) return res.status(404).json(null)

  const data = await fetcher(
    `https://api.opensea.io/api/v1/asset_contract/${address}`,
    {
      headers: {
        "X-API-KEY": process.env.OPENSEA_API_KEY,
      },
    }
  )
    .then((openseaData) => ({
      image: openseaData.image_url,
      slug: openseaData.collection?.slug,
    }))
    .catch((_) => null)

  res.json(data)
}
