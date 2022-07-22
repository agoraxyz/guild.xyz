const shortenHex = (hex: string, length = 4): string =>
  `${hex.substring(0, length + (hex.startsWith("0x") ? 2 : 0))}…${hex.substring(
    hex.length - length
  )}`

export default shortenHex
