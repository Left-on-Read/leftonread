import {
  Box,
  Button,
  Skeleton,
  Stack,
  Text,
  theme as defaultTheme,
} from '@chakra-ui/react';
import { RespondRemindersResult } from 'analysis/queries/RespondReminders';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { FiVoicemail } from 'react-icons/fi';

import { logEvent } from '../../utils/analytics';
import { typeMessageToPhoneNumber } from '../../utils/appleScriptCommands';
import { useGlobalContext } from '../Dashboard/GlobalContext';
import { GraphContainer } from './GraphContainer';

function hasNumber(myString: string) {
  return /\d/.test(myString);
}

function scoreReminder(reminder: RespondRemindersResult) {
  // Longer is good
  // Includes ? is good
  // Contact is legit is good
  return (
    reminder.message.length +
    100 *
      (reminder.message.includes('?') ? 2 : 1) *
      (hasNumber(reminder.friend) ? 1 : 3)
  );
}

export function RespondReminders() {
  const NUMBER_OF_REMINDERS = 4;
  const [isLoadingReminderArray, setIsLoadingReminderArray] = useState<
    boolean[]
  >(Array(NUMBER_OF_REMINDERS).fill(false));
  const { isPremium } = useGlobalContext();

  const [reminders, setReminders] = useState<RespondRemindersResult[]>([]);
  const [error, setError] = useState<null | string>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRespondReminders = async () => {
      setIsLoading(true);
      try {
        const results = await ipcRenderer.invoke('query-respond-reminders');

        setReminders(results);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRespondReminders();
  }, []);

  const sortedReminders = reminders.sort(
    (a, b) => scoreReminder(b) - scoreReminder(a)
  );
  const reminderContent = isLoading ? (
    <>
      {isLoadingReminderArray.map(() => (
        <Skeleton height={40} />
      ))}
    </>
  ) : (
    sortedReminders.slice(0, NUMBER_OF_REMINDERS).map((reminder, i) => {
      return (
        <Box
          key={reminder.friend}
          style={{
            border: `1px solid ${defaultTheme.colors.gray['200']}`,
            padding: 32,
            borderRadius: 16,
          }}
          shadow="xl"
        >
          <Text color="gray.500" fontSize={14}>
            From{' '}
            <span
              style={{
                fontWeight: 'bold',
                color: defaultTheme.colors.blue['400'],
              }}
            >
              {reminder.friend}
            </span>
            <span style={{ margin: '0 6px' }}>on</span>
            <span style={{ fontWeight: 'bold' }}>
              {new Date(reminder.date).toLocaleString()}
            </span>
          </Text>

          <Text style={{ marginTop: 8 }}>{reminder.message}</Text>
          <Box style={{ marginTop: 24 }}>
            <Button
              isLoading={isLoadingReminderArray[i]}
              loadingText="Opening iMessage..."
              tabIndex={-1}
              disabled={!isPremium}
              colorScheme="blue"
              size="sm"
              onClick={async () => {
                const temp = [...isLoadingReminderArray];
                temp[i] = true;
                setIsLoadingReminderArray(temp);
                await typeMessageToPhoneNumber({
                  message: 'Hey, meant to follow up on this earlier!',
                  // NOTE(Danilowicz): if we get reports of this not working,
                  // we should use the phone number here, which might have a
                  // a higher success rate
                  phoneNumber: reminder.friend,
                });
                const temp2 = [...isLoadingReminderArray];
                temp2[i] = false;
                setIsLoadingReminderArray(temp2);
                logEvent({
                  eventName: 'RESPOND_TO_REMINDER',
                });
              }}
            >
              Respond
            </Button>
          </Box>
        </Box>
      );
    })
  );

  return (
    <GraphContainer
      title="Reminders"
      description="Did you forget to respond to these messages?"
      icon={FiVoicemail}
      isPremiumGraph
    >
      <Stack spacing={8}>
        {error && <Text color="red.400">Uh oh! Something went wrong... </Text>}
        {!error && reminderContent}
        {reminders.length === 0 && !error && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: 30,
            }}
          >
            <div
              style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>{`Looks like you don't have any reminders...`}</Text>
              <Text>
                Try refreshing your data to make sure everything is up to date!
              </Text>
            </div>
          </div>
        )}
      </Stack>
    </GraphContainer>
  );
}
