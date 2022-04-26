import { Requirement } from "types"

const preprocessRequirements = (requirements: Array<Requirement>) => {
  if (!requirements || !Array.isArray(requirements)) return undefined

  const freeRequirement = requirements.find(
    (requirement) => requirement.type === "FREE"
  )

  if (freeRequirement) return [freeRequirement]

  // see the comment in Requirements.tsx at line 42
  return (
    requirements
      // Filtering only the active requirements
      .filter((requirement) => !!requirement.type)
      // Setting unused props to undefined, so we don't send them to the API
      .map((requirement) => {
        const processedRequirement = {
          ...requirement,
          nftRequirementType: undefined,
        }

        if (requirement.address === null) requirement.address = undefined

        if (
          requirement.data?.attribute &&
          !requirement.data?.attribute?.trait_type &&
          !requirement.data?.attribute?.value &&
          !requirement.data?.attribute?.interval
        )
          requirement.data.attribute = undefined

        return processedRequirement
      })
  )
}

export default preprocessRequirements
