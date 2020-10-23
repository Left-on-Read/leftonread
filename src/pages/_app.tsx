import { AppProps } from 'next/app'
import { CacheProvider, css, Global } from '@emotion/core'
import { cache } from 'emotion'

function App({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider value={cache}>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            min-height: 100vh;
            font-family: Roboto;
          }
        `}
      />
      <Component {...pageProps} />
    </CacheProvider>
  )
}

export default App
