const bufferToHex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("")

const hexToBuffer = (hexString: string): ArrayBuffer =>
  new Uint8Array(
    hexString.match(/[0-9a-f]{2}/gi).map((hexPair) => parseInt(hexPair, 16))
  ).buffer

const strToBuffer = (string: string): ArrayBuffer =>
  new Uint8Array(string.match(/./gi).map((char) => char.charCodeAt(0))).buffer

export { bufferToHex, hexToBuffer, strToBuffer }
