import Document, { Head, Html, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en-US">
        <Head>
          <link
            rel="preload stylesheet"
            as="style"
            href="https://rsms.me/inter/inter.css"
            crossOrigin="anonymous"
          />
          <link
            rel="preload stylesheet"
            as="style"
            href="/fonts/fonts.css"
            crossOrigin="anonymous"
          />
          {process.env.NODE_ENV === "production" && (
            <>
              <script
                async
                defer
                src="/js/script.js"
                data-api="/api/event"
                data-domain="guild.xyz"
                integrity="sha384-0tX/C66trbqI1ludXxeZmlfZv7n7W+SsSI45FPLHoK49MIpj6t7dyZ7CalV7x2pk sha512-xxUSMp7hFFv5deBo21s6s8F9FrPNGzwGMsHm5pXk4/S6V/A0avwKDeZ9krDgdgmfU9BSq0YpdS/jemVu49JnQA=="
              ></script>
            </>
          )}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@guildxyz" />
          <link rel="shortcut icon" href="/guild-icon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div
            id="chakra-react-select-portal"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 9999,
              width: 0,
              height: 0,
            }}
          />
          <canvas
            id="js-confetti-canvas"
            style={{
              position: "fixed",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              zIndex: 10001,
              pointerEvents: "none",
            }}
          />
        </body>
      </Html>
    )
  }
}

export default MyDocument
