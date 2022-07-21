const parseFromObject = (obj, path) =>
  path.split(".").reduce((accObj, currKey) => accObj?.[currKey], obj)

export default parseFromObject
