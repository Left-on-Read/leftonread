import { ChakraProvider } from '@chakra-ui/react'
import { css, Global } from '@emotion/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import { chakraTheme } from '../theme/index'
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
          content="What will you learn from your text messages? Left on Read is the internet's first and open-source iMessage analyzer app."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ChakraProvider theme={chakraTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default App
