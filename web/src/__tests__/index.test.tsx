import { render } from '@testing-library/react'

import Landing from '../pages/index'
import PrivacyPolicy from '../pages/privacy'
import TermsOfService from '../pages/terms'

jest.mock('react-chartjs-2')

describe('Page sanity checks', () => {
  it('renders Landing without crashing', () => {
    render(<Landing />)
  })

  it('renders Privacy Policy without crashing', () => {
    render(<PrivacyPolicy />)
  })

  it('renders Terms of Service without crashing', () => {
    render(<TermsOfService />)
  })
})
