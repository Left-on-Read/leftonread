import { fireEvent, render, screen } from '@testing-library/react'

import Landing from '../pages/index'
// import { writeEmailToFirestore } from '../utils/firestore'

jest.mock('react-chartjs-2')
jest.mock('../utils/firestore')

window.HTMLElement.prototype.scrollIntoView = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

it('renders core interaction elements', () => {
  render(<Landing />)
  const CTAButton = screen.getByTestId('cta-button')
  expect(CTAButton).toBeVisible()

  // const GetNotifiedInput = screen.getByTestId('get-notified-input')
  // expect(GetNotifiedInput).toBeVisible()

  // const GetNotifiedButton = screen.getByTestId('get-notified-button')
  // expect(GetNotifiedButton).toBeVisible()
})

it('scrolls to notification section when CTA button is clicked', () => {
  render(<Landing />)
  const CTAButton = screen.getByTestId('cta-button')
  fireEvent.click(CTAButton)

  // NOTE(teddy): Making assumptions here... should come back and write a more robust test
  expect(window.HTMLElement.prototype.scrollIntoView).toBeCalledTimes(1)
})

// it('allows email submission', async () => {
//   render(<Landing />)
//   const testEmail = 'test@test.com'
//   const GetNotifiedInput = screen.getByTestId('get-notified-input')
//   const GetNotifiedButton = screen.getByTestId('get-notified-button')

//   fireEvent.change(GetNotifiedInput, { target: { value: testEmail } })
//   fireEvent.click(GetNotifiedButton)

//   await waitFor(() => {
//     expect(screen.getByTestId('status-message')).toBeInTheDocument()
//   })

//   expect(writeEmailToFirestore).toBeCalledTimes(1)
//   expect(writeEmailToFirestore).toBeCalledWith(testEmail)
// })

// it('does not send submit invalid email', async () => {
//   render(<Landing />)
//   const testEmail = 'test'
//   const GetNotifiedInput = screen.getByTestId('get-notified-input')
//   const GetNotifiedButton = screen.getByTestId('get-notified-button')

//   fireEvent.change(GetNotifiedInput, { target: { value: testEmail } })
//   fireEvent.click(GetNotifiedButton)

//   await waitFor(() => {
//     expect(screen.getByTestId('status-message')).toBeInTheDocument()
//   })

//   expect(writeEmailToFirestore).toBeCalledTimes(0)
// })
