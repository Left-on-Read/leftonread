import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

import SeasonChange from '../../../assets/illustrations/season_change.svg';
import { ScheduledMessage } from '../../constants/types';
import { logEvent } from '../../utils/analytics';
import { useGlobalContext } from '../Dashboard/GlobalContext';
import { Float } from '../Float';

const getDefaultDate = () => {
  const defaultDate = new Date();
  defaultDate.setMinutes(new Date().getMinutes() + 5);
  return defaultDate;
};

export function MessageSchedulerModal({
  isOpen,
  onClose,
  refresh,
}: {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
}) {
  const { contacts } = useGlobalContext();

  const [dateTime, setDateTime] = useState<Date>(getDefaultDate());
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const [selectedContact, setSelectedContact] = useState<{
    value: string;
    label: string;
  }>({
    value: '',
    label: '',
  });

  const selectedPhoneNumber = selectedContact.value;

  const scheduleMessage = async () => {
    // Find matching contact
    const contactName =
      contacts?.find((contact) => contact.phoneNumber === selectedPhoneNumber)
        ?.value ?? selectedPhoneNumber;

    const newMessage: ScheduledMessage = {
      id: uuidv4(),
      message,
      phoneNumber: selectedPhoneNumber,
      contactName,
      sendDate: dateTime,
    };

    await ipcRenderer.invoke('add-scheduled-message', newMessage);
    logEvent({
      eventName: 'SCHEDULED_MESSAGE',
    });
    refresh();
  };

  const validate = () => {
    setError(null);
    if (!selectedPhoneNumber) {
      setError('Missing phone number.');
      return false;
    }

    if (!message) {
      setError('Missing message.');
      return false;
    }

    if (dateTime < new Date()) {
      setError('Date must be in the future.');
      return false;
    }

    return true;
  };

  const finishOnboarding = async () => {
    await ipcRenderer.invoke('add-completed-onboarding', 'MESSAGE_SCHEDULER');
    setShowOnboarding(false);
  };

  useEffect(() => {
    const fetchCobs = async () => {
      const cobs = await ipcRenderer.invoke('get-completed-onboardings');
      if (!cobs.includes('MESSAGE_SCHEDULER')) {
        setShowOnboarding(true);
      }
    };

    fetchCobs();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setDateTime(getDefaultDate());
      setMessage('');
      setSelectedContact({ value: '', label: '' });
    }
  }, [isOpen]);

  const contactOptions = contacts?.map((contact) => ({
    value: contact.phoneNumber,
    label: contact.label,
  }));

  let content = (
    <>
      <ModalHeader>Schedule a Message</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl>
          <FormLabel>Contact</FormLabel>
          {/* <Select
            placeholder="Select a contact"
            value={selectedPhoneNumber}
            onChange={(event) => {
              setSelectedPhoneNumber(event.target.value);
            }}
          >
            {contacts.map((contact) => (
              <option value={contact.phoneNumber}>{`${contact.label}`}</option>
            ))}
          </Select> */}
          <Select
            value={selectedContact}
            onChange={(newValue) => {
              if (newValue) {
                setSelectedContact(newValue);
              }
            }}
            options={contactOptions}
          />
        </FormControl>
        <FormControl style={{ marginTop: 16 }}>
          <FormLabel>Message</FormLabel>
          <Textarea
            size="md"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </FormControl>
        <FormControl style={{ marginTop: 16 }}>
          <FormLabel>Date & Time</FormLabel>
          <DateTimePicker
            onChange={(newValue) => setDateTime(newValue)}
            value={dateTime}
            calendarIcon={null}
            clearIcon={null}
            minDate={new Date()}
            disableClock
            className="date-time-picker"
          />
        </FormControl>
        {error && (
          <Text color="red.400" fontWeight="medium" style={{ marginTop: 14 }}>
            {error}
          </Text>
        )}
      </ModalBody>

      <ModalFooter>
        <Button
          colorScheme="purple"
          mr={3}
          onClick={async () => {
            if (validate()) {
              await scheduleMessage();
              onClose();
            }
          }}
          loadingText="Loading Settings..."
        >
          Schedule
        </Button>
      </ModalFooter>
    </>
  );

  if (showOnboarding) {
    content = (
      <>
        <ModalHeader>Schedule a Message</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Float
              circleShadowDimensions={{
                marginTop: 10,
                width: 60,
              }}
            >
              <img
                src={SeasonChange}
                alt="SeasonChange"
                style={{
                  width: '100px',
                  height: '100px',
                  border: '1px solid lightgray',
                  borderRadius: '50%',
                }}
              />
            </Float>
            <div style={{ marginTop: 20 }}>
              <Text>
                {`We're thrilled to introduce the ability to schedule a message!`}{' '}
                <span
                  style={{ fontWeight: 500 }}
                >{`Here's how it works:`}</span>
              </Text>
              <div style={{ padding: '8px 36px' }}>
                <ol>
                  <li style={{ padding: '4px 0px' }}>
                    Specify a recipient, date and time.
                  </li>
                  <li style={{ padding: '4px 0px' }}>Compose your message.</li>
                  <li style={{ padding: '4px 0px' }}>
                    The message will send at the specified time.
                    <ul style={{ padding: '4px 14px' }}>
                      <li style={{ padding: '4px 0px' }}>
                        If the Left on Read app is not running, the message will
                        not send.
                      </li>
                      <li style={{ padding: '4px 0px' }}>
                        If your laptop is asleep, the message will send once
                        your laptop wakes back up.
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="purple"
            mr={3}
            onClick={async () => {
              finishOnboarding();
            }}
          >
            {`Got it - let's get scheduling!`}
          </Button>
        </ModalFooter>
      </>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>{content}</ModalContent>
    </Modal>
  );
}
