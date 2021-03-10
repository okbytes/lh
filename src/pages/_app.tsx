import "styles/index.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { DefaultSeo } from "next-seo"
import SEO from "../../next-seo.json"
import { ProvideAuth } from "utils/use-auth"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <ProvideAuth>
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
      </ProvideAuth>
    </>
  )
}

export default App
