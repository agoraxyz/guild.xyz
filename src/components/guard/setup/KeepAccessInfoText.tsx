import { Box, Text } from "@chakra-ui/react"

const KeepAccessInfoText = (): JSX.Element => (
  <Box px={5} pb={4} whiteSpace="break-spaces">
    <Text fontWeight="normal" fontSize="sm" lineHeight="150%">
      Keep access for users with any role in your server. There are ? members without
      any role, if you want them to auto-access too, give them a role!
    </Text>
  </Box>
)

export default KeepAccessInfoText
