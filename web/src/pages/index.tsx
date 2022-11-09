import * as React from 'react'

import { Footer } from '../components/Footer'
import { Download } from '../components/sections/Download'
import { GetStarted } from '../components/sections/GetStarted'
import { Infographic } from '../components/sections/Infographic'
import { Security } from '../components/sections/Security'
import { Wrapped } from '../components/sections/Wrapped'

// TODO(teddy): Add a minheight
export default function Landing() {
  const ctaRef = React.useRef<HTMLDivElement>(null)

  // NOTE(teddy): Important we don't wrap with a div so that the footer is a direct child of the body tag.
  return (
    <>
      <GetStarted ctaRef={ctaRef} />
      <Wrapped />
      <Infographic />
      <Security />
      <Download ctaRef={ctaRef} />
      <Footer />
    </>
  )
}
