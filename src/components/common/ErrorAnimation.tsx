import { LazyMotion, m } from "framer-motion"
import { PropsWithChildren, useEffect, useState } from "react"

const loadDomAnimationFeatures = () =>
  import("../../framerMotion/domAnimation").then((res) => res.default)

type Props = {
  errors: any
}

const ErrorAnimation = ({
  errors,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const [errorAnimation, setErrorAnimation] = useState<string | string[]>(
    "translateX(0px)"
  )

  useEffect(() => {
    if (errors)
      setErrorAnimation([
        "translateX(0px) translateY(0px)",
        "translateX(-25px) translateY(0)",
        "translateX(25px) translateY(20px)",
        "translateX(-25px) translateY(10px)",
        "translateX(25px) translateY(10px)",
        "translateX(-25px) translateY(20px)",
        "translateX(25px) translateY(0px)",
        "translateX(0px) translateY(0px)",
      ])
  }, [errors])

  return (
    <LazyMotion features={loadDomAnimationFeatures}>
      <m.div
        onAnimationComplete={() => setErrorAnimation("translateX(0px)")}
        style={{
          position: "relative",
          transformOrigin: "bottom center",
          transform: "translateX(0px)",
        }}
        animate={{
          transform: errorAnimation,
        }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}

export default ErrorAnimation
