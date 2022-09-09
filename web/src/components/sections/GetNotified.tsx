import { Box, Button, FormControl, Icon, Input } from '@chakra-ui/react'
import * as React from 'react'
import { FiCheckCircle } from 'react-icons/fi'

import { writeEmailToFirestore } from '../../utils/firestore'
import { isValidEmail } from '../../utils/validation'
import { StatusLoaderState } from '../StatusLoader'

export function GetNotified({}) {
  const [email, setEmail] = React.useState<string>('')
  // const [message, setMessage] = React.useState<string | undefined>(undefined)
  const [state, setState] = React.useState<StatusLoaderState | null>(null)

  const signUpEmail = async (submittedEmail: string) => {
    if (!isValidEmail(submittedEmail)) {
      setState('error')
      // setMessage('Please enter a valid email.')
      return
    }

    setState('loading')
    // setMessage(undefined)

    try {
      await writeEmailToFirestore(submittedEmail)
      setState('success')
      // setMessage('Successfully signed up!')
    } catch (e) {
      setState('error')
      // setMessage('Uh oh, something went wrong.')
    }
  }

  const handleSubmitNotify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signUpEmail(email)
  }

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <form onSubmit={handleSubmitNotify}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <FormControl>
            <Input
              size="sm"
              placeholder={'you@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === 'loading' || state === 'success'}
              focusBorderColor={'gray.200'}
              isInvalid={state === 'error'}
            />
          </FormControl>
          <Button
            isLoading={state === 'loading'}
            loadingText="Submitting..."
            disabled={state === 'loading' || state === 'success'}
            type="submit"
            size="sm"
            style={{
              padding: '15px 25px',
              marginLeft: '10px',
              transition: '.25s',
            }}
            leftIcon={
              state === 'success' ? (
                <Icon as={FiCheckCircle} color="green.600" />
              ) : undefined
            }
          >
            <span className="primary">
              {state === 'success' ? <>Success</> : <>Enter</>}
            </span>
          </Button>
        </div>
      </form>
    </Box>
  )
}
