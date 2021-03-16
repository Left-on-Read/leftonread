import { AppProps } from 'next/app'
import { CacheProvider, css, Global } from '@emotion/core'
import { cache } from 'emotion'
import { useRouter } from 'next/router'
import * as React from 'react'
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

  return (
    <CacheProvider value={cache}>
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
    </CacheProvider>
  )
}

export default App
