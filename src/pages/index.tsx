/** @jsx jsx */
import { jsx } from '@emotion/core'

import { GetStarted } from '../components/sections/GetStarted'
import { Infographic } from '../components/sections/Infographic'

// TODO(teddy): Add a minheight
export default function Landing() {
  return (
    <div>
      {/* <GetStarted />
      <Infographic /> */}
      <GetStarted />
      <Infographic />
    </div>
  )
}
