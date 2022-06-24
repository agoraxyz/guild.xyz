import { Box, HStack, Stack, useColorModeValue } from "@chakra-ui/react"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import useGuild from "../hooks/useGuild"
import TabButton from "./components/TabButton"

const Tabs = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const tabsRef = useRef()
  const [isSticky, setIsSticky] = useState(false)

  const { urlName } = useGuild()
  const bgColor = useColorModeValue("white", "gray.800")

  useEffect(() => {
    const handleScroll = () => {
      const current = tabsRef.current || null
      const rect = current?.getBoundingClientRect()

      setIsSticky(rect?.top <= 0)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <Stack
      ref={tabsRef}
      direction="row"
      justifyContent="space-between"
      position="sticky"
      top={0}
      py={3}
      mt={-3}
      mb={3}
      width="full"
      zIndex={isSticky ? "banner" : "auto"}
      _before={{
        content: `""`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "full",
        // button height + padding
        height: "calc(var(--chakra-space-11) + (2 * var(--chakra-space-3)))",
        bgColor: bgColor,
        boxShadow: "md",
        transition: "opacity 0.2s ease, visibility 0.1s ease",
        visibility: isSticky ? "visible" : "hidden",
        opacity: isSticky ? 1 : 0,
      }}
    >
      <Box
        position="relative"
        ml={-8}
        minW="0"
        sx={{
          "-webkit-mask-image":
            "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent)",
        }}
      >
        <HStack
          overflowX="auto"
          px={8}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          <TabButton href={`/${urlName}`}>Roles</TabButton>
          <TabButton href="#" disabled tooltipText="Stay tuned!">
            More tabs soon
          </TabButton>
        </HStack>
      </Box>

      {children && <Box>{children}</Box>}
    </Stack>
  )
}

export default Tabs
