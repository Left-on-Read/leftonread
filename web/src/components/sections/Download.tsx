import { DownloadIcon } from '@chakra-ui/icons'
import { Box, Button, Text } from '@chakra-ui/react'

// import { useState } from 'react'
// import { FaFacebookMessenger } from 'react-icons/fa'
// import { FiCheckCircle } from 'react-icons/fi'
import { LATEST_APP_VERSION_FOR_MARKETING_SITE } from '../../constants/APP_VERSION'
// import { addContact } from '../../utils/addContact'
import { logEvent } from '../../utils/gtag'
// import { isValidEmail } from '../../utils/validation'
import { DefaultContentContainer } from '../DefaultContentContainer'
// import { StatusLoaderState } from '../StatusLoader'

export const handleDownload = () => {
  logEvent({
    action: 'download',
    category: 'Download',
  })
  window.location.href = `https://github.com/Left-on-Read/leftonread/releases/download/v${LATEST_APP_VERSION_FOR_MARKETING_SITE}/Left-on-Read-${LATEST_APP_VERSION_FOR_MARKETING_SITE}.dmg`
}

export function Download({
  ctaRef,
}: {
  ctaRef: React.RefObject<HTMLDivElement>
}) {
  // const [email, setEmail] = useState<string>('')
  // const [state, setState] = useState<StatusLoaderState | null>(null)

  // const signUpEmail = async (submittedEmail: string) => {
  //   if (!isValidEmail(submittedEmail)) {
  //     setState('error')
  //     // setMessage('Please enter a valid email.')
  //     return
  //   }

  //   setState('loading')
  //   // setMessage(undefined)

  //   try {
  //     await addContact({
  //       email: submittedEmail,
  //       type: 'FB_MESSENGER_WAITLIST',
  //     })
  //     setState('success')
  //     // setMessage('Successfully signed up!')
  //   } catch (e) {
  //     console.error(e)
  //     setState('error')
  //     // setMessage('Uh oh, something went wrong.')
  //   }
  // }

  // const handleSubmitNotify = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   signUpEmail(email)
  // }

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      bgGradient="linear(to-b, blue.50, green.50)"
      ref={ctaRef}
    >
      <DefaultContentContainer>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            marginTop: 80,
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            {/* <Image src={'/ICON.png'} height={70} width={70} /> */}
            <Text
              fontSize={{
                base: '4xl',
                md: '5xl',
                lg: '7xl',
              }}
              fontWeight="extrabold"
              bgGradient="linear(to-r, blue.400, purple.400)"
              bgClip="text"
            >
              Get Left on Read
            </Text>
          </Box>

          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 80,
            }}
          >
            <Text
              fontSize={{
                base: 'lg',
                md: 'xl',
                lg: '2xl',
              }}
              textAlign={{
                base: 'center',
                lg: 'start',
              }}
            >
              Relive your best texts of the year. Free to try and built for you.
            </Text>
            <Button
              colorScheme="purple"
              rightIcon={<DownloadIcon />}
              size={{
                base: 'lg',
              }}
              fontSize={{
                base: 'lg',
                md: 'xl',
                lg: '2xl',
              }}
              style={{ marginTop: 40 }}
              shadow="xl"
              padding={{
                sm: 3,
                lg: 7,
              }}
              // ref={ctaRef}
              onClick={handleDownload}
            >
              Download for Mac
            </Button>
          </Box>
          {/* <Box
            style={{
              backgroundColor: 'white',
              borderRadius: 32,
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 120,
            }}
            margin={{
              base: '0',
              lg: '8%',
            }}
            padding={{
              base: '10%',
              md: '5%',
              lg: '5%',
            }}
            bgGradient="linear(to-tr, #0695FF, #A334FA, #FF6968)"
            flexDirection={{
              base: 'column',
              lg: 'row',
            }}
          >
            <Box width={{ base: '100%' }}>
              <Box
                style={{
                  lineHeight: 1.3,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Icon
                      as={FaFacebookMessenger}
                      color="white"
                      fontSize={{
                        base: 'xl',
                        md: '2xl',
                        lg: '3xl',
                      }}
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      color="white"
                      fontSize={{
                        base: 'xl',
                        md: '2xl',
                        lg: '3xl',
                      }}
                      fontWeight="extrabold"
                    >
                      Get Early Access to Messenger
                    </Text>
                  </div>

                  <Text
                    color="white"
                    fontSize={{
                      base: 'md',
                      lg: 'xl',
                    }}
                    marginTop={{
                      base: 4,
                      lg: 8,
                    }}
                  >
                    {`We're working on bringing the platform you know and love to FB Messenger.`}
                  </Text>
                  <Text
                    color="white"
                    fontSize={{
                      base: 'md',
                      lg: 'xl',
                    }}
                    marginTop={{
                      base: 2,
                      lg: 4,
                    }}
                  >
                    Sign up here to get notified for early access!
                  </Text>
                  <Box style={{ marginTop: 22, width: '80%' }}>
                    <form onSubmit={handleSubmitNotify}>
                      <Box
                        style={{
                          display: 'flex',
                        }}
                        flexDirection={{
                          base: 'column',
                          md: 'row',
                        }}
                        alignItems={{
                          base: 'flex-start',
                          md: 'center',
                        }}
                      >
                        <FormControl>
                          <Input
                            size="md"
                            placeholder={'you@example.com'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={
                              state === 'loading' || state === 'success'
                            }
                            focusBorderColor={'gray.200'}
                            isInvalid={state === 'error'}
                            style={{
                              borderRadius: 8,
                              backgroundColor: 'white',
                            }}
                          />
                        </FormControl>
                        <Button
                          isLoading={state === 'loading'}
                          loadingText="Submitting..."
                          disabled={state === 'loading' || state === 'success'}
                          type="submit"
                          size="md"
                          style={{
                            padding: '15px 25px',
                            transition: '.25s',
                          }}
                          marginLeft={{
                            base: '0px',
                            md: '10px',
                          }}
                          marginTop={{
                            base: '8px',
                            md: '0px',
                          }}
                          leftIcon={
                            state === 'success' ? (
                              <Icon as={FiCheckCircle} color="green.600" />
                            ) : undefined
                          }
                        >
                          <span className="primary">
                            {state === 'success' ? (
                              <>Success</>
                            ) : (
                              <>Get Notified</>
                            )}
                          </span>
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box> */}
          {/* <Box
            style={{
              backgroundColor: 'white',
              borderRadius: 32,
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 120,
            }}
            margin={{
              base: '0',
              lg: '8%',
            }}
            padding={{
              base: '10%',
              md: '5%',
              lg: '5%',
            }}
            bgGradient="linear(to-br, yellow.500, yellow.700)"
            flexDirection={{
              base: 'column',
              lg: 'row',
            }}
          >
            <Box width={{ base: '100%' }}>
              <Box
                style={{
                  lineHeight: 1.3,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Text
                    color="white"
                    fontSize={{
                      base: '2xl',
                      md: '3xl',
                      lg: '4xl',
                    }}
                    fontWeight="extrabold"
                  >
                    Left on Read Gold 🌟
                  </Text>
                  <Text
                    color="white"
                    fontSize={{
                      base: 'md',
                      lg: 'xl',
                    }}
                    marginTop={{
                      base: 4,
                      lg: 8,
                    }}
                  >
                    Left on Read is free to try! To unlock more advanced
                    analytics and features, we offer Left on Read Gold for
                    $2.99/month.
                  </Text>
                  <Text
                    color="white"
                    fontSize={{
                      base: 'md',
                      lg: 'xl',
                    }}
                    marginTop={{
                      base: 4,
                      lg: 8,
                    }}
                  >
                    This helps us keep Left on Read running, and continue to
                    work on bringing exciting new features to you!
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box> */}
        </Box>
      </DefaultContentContainer>
    </Box>
  )
}
