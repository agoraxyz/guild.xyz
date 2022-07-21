const pluralize = (count: number, noun: string, suffix = "s") =>
  `${count ?? 0} ${noun}${count !== 1 ? suffix : ""}`

export default pluralize
