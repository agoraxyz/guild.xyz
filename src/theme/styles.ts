import { mode } from "@chakra-ui/theme-tools"

const styles = {
  global: (props) => ({
    /**
     * Hacky solution to the bug that toasts just partially follow the color mode if
     * user switches after they're initialized. We're changing the background of
     * their container (since it works), and just apply the same color for them
     * transparentized in both light and dark mode (in alert.ts)
     */
    ".chakra-toast__inner": {
      bg: mode("white", "gray.700")(props),
      borderRadius: "lg",
    },
    /**
     * Chakra manages styles in FormGroup regardless if it has InputLeftAddon or
     * InputLeftElement components inside it via Context instead of plain css.
     * ChakraReactSelect can't read that context, so we're applying the desired rules
     * for that manually
     */
    ".chakra-input__left-addon ~ * > div": {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    "#lottie path": {
      fill: mode("currentColor", "white")(props),
      stroke: mode("currentColor", "white")(props),
      strokeWidth: "2px",
    },
    ".chakra-input__left-element ~ * > div": {
      paddingInlineStart: 5,
    },
    ".chakra-ui-dark *::-webkit-calendar-picker-indicator": {
      filter: "invert(1)",
    },
    "@keyframes fadeIn": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
  }),
}

export default styles
