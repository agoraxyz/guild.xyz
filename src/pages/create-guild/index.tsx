import { WithRumComponentContext } from "@datadog/rum-react-integration"
import Layout from "components/common/Layout"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { useRouter } from "next/router"

const CreateGuildPage = (): JSX.Element => {
  const router = useRouter()

  return (
    <Layout title="Choose platform">
      <PlatformsGrid
        onSelection={(selectedPlatform) =>
          router.push(`/create-guild/${selectedPlatform.toLowerCase()}`)
        }
      />
    </Layout>
  )
}

export default WithRumComponentContext("Create guild index page", CreateGuildPage)
