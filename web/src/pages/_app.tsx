import { css, Global } from '@emotion/react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import * as React from 'react'
import Head from 'next/head'
import { initFirestore } from '../utils/firestore'
import * as gtag from '../utils/gtag'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageView(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  React.useEffect(() => {
    initFirestore()
  }, [])

  return (
    <>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            min-height: 100vh;
            font-family: Roboto;
            overflow-x: hidden;
            scroll-behavior: smooth;
          }
        `}
      />
      <Head>
        <title>Left on Read</title>
        <meta
          name="description"
          content="What can you learn from your text messages? Left on Read is the internet's first and only free and open-source iMessage analyzing app"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
