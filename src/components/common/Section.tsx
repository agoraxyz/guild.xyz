import { Box, Heading, HStack, Stack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  title?: string | JSX.Element
  titleRightElement?: JSX.Element
} & Rest

const Section = ({
  title,
  titleRightElement,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Box w="full">
    {title && (
      <HStack spacing={2} alignItems="center" mb="5">
        <Heading fontSize={{ base: "md", sm: "lg" }} as="h3">
          {title}
        </Heading>
        {titleRightElement}
      </HStack>
    )}
    <Stack w="full" spacing={5} {...rest}>
      {children}
    </Stack>
  </Box>
)

export default Section
export type { Props as SectionProps }
