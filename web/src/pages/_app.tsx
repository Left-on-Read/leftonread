import { css, Global } from '@emotion/react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import * as React from 'react'

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
      <Component {...pageProps} />
    </>
  )
}

export default App
