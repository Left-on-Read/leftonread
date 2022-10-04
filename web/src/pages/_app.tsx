import { ChakraProvider } from '@chakra-ui/react'
import { css, Global } from '@emotion/react'
import { Chart, registerables } from 'chart.js'
import gradient from 'chartjs-plugin-gradient'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import { chakraTheme } from '../theme/index'
import { initFirestore } from '../utils/firestore'
import * as gtag from '../utils/gtag'

Chart.register(...(registerables ?? []))
Chart.register(gradient)

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Left on Read: iMessage Analyzer" />
        <meta
          property="og:description"
          content="Spotify Wrapped for your text messages"
        />
        <meta property="og:url" content="https://leftonread.me" />
        <meta
          property="og:image"
          content="https://i.ibb.co/sKbpjMp/og-preview.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" sizes="16x16 32x32 64x64" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="196x196"
          href="/favicon-192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="160x160"
          href="/favicon-160.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="64x64"
          href="/favicon-64.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16.png"
        />

        <link rel="apple-touch-icon" href="/favicon-57.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon-114.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon-72.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon-144.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon-60.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon-120.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon-76.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon-152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="/favicon-144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1130957880846683');
  fbq('track', 'PageView');
`,
          }}
        />
      </Head>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src="https://www.facebook.com/tr?id=1130957880846683&ev=PageView&noscript=1"
      />{' '}
      <ChakraProvider theme={chakraTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default App
