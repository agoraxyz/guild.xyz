import { mode } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const styles = {
  parts: ["dialog", "closeButton", "header", "footer", "body"],
  baseStyle: (props: Dict) => {
    const { colorScheme: c } = props
    const backgroundColor = c === "dark" && mode("gray.50", "gray.800")(props)

    return {
      dialog: {
        borderTopRadius: "xl",
        borderBottomRadius: { base: 0, sm: "xl" },
        overflow: "hidden",
        marginTop: "auto",
        marginBottom: { base: 0, sm: "auto" },
        // we can't add data attributes to the Modal component so we have
        // to prevent the focus-visible polyfill from removing shadow on
        // focus by overriding it's style with the default box-shadow
        ":focus:not([data-focus-visible-added])": {
          boxShadow: mode("lg", "dark-lg")(props),
        },
      },
      closeButton: {
        borderRadius: "full",
        top: 7,
        right: 7,
      },
      header: {
        pl: { base: 6, sm: 10 },
        pr: { base: 16, sm: 10 },
        py: 8,
        fontFamily: "display",
        fontWeight: "bold",
        backgroundColor,
      },
      body: {
        px: { base: 6, sm: 10 },
        pt: { base: 1, sm: 2 },
        pb: { base: 9, sm: 10 },
        backgroundColor,
      },
      footer: {
        px: { base: 6, sm: 10 },
        pt: 2,
        pb: 10,
        backgroundColor,
      },
      overlay: {
        backdropFilter: "blur(4px)",
      },
    }
  },
}

export default styles
