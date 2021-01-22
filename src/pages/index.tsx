/** @jsx jsx */
import { jsx } from '@emotion/core'

import { GetStarted } from '../components/sections/GetStarted'
import { Infographic } from '../components/sections/Infographic'
import { GetNotified } from '../components/sections/GetNotified'
import { Footer } from '../components/Footer'

// TODO(teddy): Add a minheight
export default function Landing() {

  // NOTE(teddy): Important we don't wrap with a div so that the footer is a direct child of the body tag.
  return (
    <>
      <GetStarted />
      <Infographic />
      <GetNotified />
      <Footer />
    </>
  )
}
