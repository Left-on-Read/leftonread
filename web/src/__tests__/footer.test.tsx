import { render, screen } from '@testing-library/react'

import { Footer } from '../components/Footer'

describe('Vercel Logo and Link', () => {
  it('renders the correct logo', () => {
    render(<Footer />)
    const VercelLogo = screen.getByTestId('footer-img-vercel')
    expect(VercelLogo).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/Left-on-Read/leftonread/main/assets/documentation/powered-by-vercel.svg'
    )
  })

  it('has the correct link', () => {
    render(<Footer />)
    const VercelLink = screen.getByTestId('footer-anchor-vercel')
    expect(VercelLink).toHaveAttribute(
      'href',
      'https://vercel.com/?utm_source=leftonread&utm_campaign=oss'
    )
  })
})
