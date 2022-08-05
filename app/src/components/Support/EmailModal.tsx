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
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

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

  const handleSend = async () => {
    setHasTriedSubmitting(true);
    if (!email || !reason || !content) {
      return;
    }

    await ipcRenderer.invoke('get-logs', email, reason, content);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent style={{ width: '80vw' }}>
        <ModalHeader>Contact Us</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
                  <Radio size="md" value="feature_request" colorScheme="purple">
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
            <Collapse in={reason === 'support'}>
              <FormControl>
                <Checkbox
                  colorScheme="purple"
                  defaultChecked
                  style={{ marginTop: 16 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>Include logs</div>
                    <Tooltip
                      label="Logs help us identify what went wrong. They do not contain any sensitive or personally identifiying information."
                      fontSize="md"
                    >
                      <QuestionOutlineIcon style={{ marginLeft: 8 }} />
                    </Tooltip>
                  </div>
                </Checkbox>
              </FormControl>
            </Collapse>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="purple"
            onClick={handleSend}
            style={{ marginRight: 16 }}
            leftIcon={<Icon as={FiSend} />}
          >
            Send
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
