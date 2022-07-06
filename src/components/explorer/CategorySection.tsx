import { SimpleGrid, Text } from "@chakra-ui/react"
import Section, { SectionProps } from "components/common/Section"
import { AnimatePresence, LayoutGroup } from "framer-motion"
import { PropsWithChildren } from "react"

type Props = SectionProps & {
  fallbackText: string
}

const CategorySection = ({
  fallbackText,
  children,
  ...rest
}: PropsWithChildren<Props>) => (
  <Section {...rest}>
    {children ? (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
        <LayoutGroup>
          <AnimatePresence>{children}</AnimatePresence>
        </LayoutGroup>
      </SimpleGrid>
    ) : (
      <Text>{fallbackText}</Text>
    )}
  </Section>
)

export default CategorySection
