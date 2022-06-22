/**
 * We're using v6 of puppeteer-core and chrome-aws-lambda so we fit in the 50mb limit
 * of Next.js serverless functions. They've got larger since then and we don't need
 * any new features
 */

import { args, defaultViewport, executablePath, puppeteer } from "chrome-aws-lambda"

const handler = async (req, res) => {
  const protocol = process.env.NODE_ENV === "production" ? `https:/` : `http:/`
  const domain =
    process.env.NODE_ENV === "production" ? req.headers.host : "localhost:3000"
  const pathArray = req.query.urlName ?? []
  const url = [protocol, domain, pathArray, "linkpreview"].join("/")

  const browser = await puppeteer.launch({
    args: [...args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: defaultViewport,
    executablePath:
      process.env.NODE_ENV === "production" ? await executablePath : undefined,
    headless: true,
    ignoreHTTPSErrors: true,
  })

  try {
    const page = await browser.newPage()
    page.setViewport({ width: 1600, height: 900 })
    const response = await page.goto(url, {
      waitUntil: "load",
      timeout: 0,
    })
    if (response.status() !== 200) return res.status(404).send("Not found")
    const screenShotBuffer = await page.screenshot({ quality: 95, type: "jpeg" })
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": Buffer.byteLength(screenShotBuffer as ArrayBuffer),
    })
    res.end(screenShotBuffer)
  } finally {
    await browser.close()
  }
}

export default handler
