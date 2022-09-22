import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { FiSend } from 'react-icons/fi';

import InstantSupport from '../../../assets/illustrations/instant_support.svg';

export function EmailModal({
  isOpen,
  onClose,
  defaultReason,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultReason?: string;
}) {
  const [email, setEmail] = useState<string>('');
  const [reason, setReason] = useState<string | undefined>(defaultReason);
  const [content, setContent] = useState<string>('');
  const [hasTriedSubmitting, setHasTriedSubmitting] = useState<boolean>(false);

  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setReason(defaultReason);
      setContent('');
      setHasTriedSubmitting(false);
      setIsSending(false);
      setError(null);
      setIsSuccess(false);
    }
  }, [isOpen, defaultReason]);

  const handleSend = async () => {
    setHasTriedSubmitting(true);
    if (!email || !reason || !content) {
      return;
    }
    setIsSending(true);

    try {
      await ipcRenderer.invoke('get-logs', email, reason, content);
      setIsSuccess(true);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent style={{ width: '80vw' }}>
        <ModalHeader>{isSuccess ? `We're on it!` : 'Contact Us'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isSuccess ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src={InstantSupport}
                boxSize="150px"
                style={{ marginRight: 64 }}
              />
              <div>
                <Text>Thanks for contacting us.</Text>
                <Text>We will respond within 24 hours.</Text>
              </div>
            </div>
          ) : (
            <div>
              <FormControl isInvalid={!email && hasTriedSubmitting}>
                <Input
                  placeholder="Your Email"
                  size="md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!email && hasTriedSubmitting ? (
                  <FormErrorMessage>Email is required</FormErrorMessage>
                ) : (
                  <FormHelperText>
                    This is how we will contact you.
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl
                isInvalid={!reason && hasTriedSubmitting}
                style={{ marginTop: 32 }}
              >
                <FormLabel>Reason</FormLabel>
                <RadioGroup value={reason} onChange={(val) => setReason(val)}>
                  <Stack direction="column">
                    <Radio size="md" value="support" colorScheme="purple">
                      Support
                    </Radio>
                    <Radio
                      size="md"
                      value="feature_request"
                      colorScheme="purple"
                    >
                      Feature Request
                    </Radio>
                    <Radio size="md" value="other" colorScheme="purple">
                      Other
                    </Radio>
                  </Stack>
                </RadioGroup>
                <FormErrorMessage>Reason is required</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!content && hasTriedSubmitting}
                style={{ marginTop: 16 }}
              >
                <FormLabel>Message</FormLabel>
                <Textarea
                  placeholder="Your message here..."
                  size="md"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <FormErrorMessage>Message content is required</FormErrorMessage>
              </FormControl>
              <Collapse in={reason === 'support' || reason === 'other'}>
                <FormControl>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 16,
                    }}
                  >
                    <Checkbox colorScheme="purple" defaultChecked>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>Attach logs</div>
                      </div>
                    </Checkbox>
                    <Tooltip
                      label="Troubleshooting logs help us identify what went wrong with Left on Read on your computer. They do not contain any text messages, contact names, or other personal identifiying information."
                      fontSize="md"
                    >
                      <QuestionOutlineIcon style={{ marginLeft: 8 }} />
                    </Tooltip>
                  </div>
                </FormControl>
              </Collapse>
              {error && (
                <div style={{ marginTop: 16 }}>
                  <Text color="red.400" fontSize="sm">
                    Error: {error}
                  </Text>
                  <Text color="red.400" fontSize="sm">
                    Please check your internet connection and try again, or
                    directly email{' '}
                    <span style={{ fontWeight: 600 }}>
                      help.leftonread@gmail.com
                    </span>
                  </Text>
                </div>
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          {!isSuccess && (
            <Button
              colorScheme="purple"
              onClick={handleSend}
              style={{ marginRight: 16 }}
              leftIcon={<Icon as={FiSend} />}
              isLoading={isSending}
            >
              Send
            </Button>
          )}
          <Button onClick={onClose}>{isSuccess ? 'Close' : 'Cancel'}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
