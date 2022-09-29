/* eslint-disable @typescript-eslint/naming-convention */
import {
  Box,
  Button,
  Icon,
  IconButton,
  Spinner,
  Text,
  theme,
  useToast,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import {
  FiArrowRightCircle,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiRefreshCw,
} from 'react-icons/fi';
import Select from 'react-select';

import { InboxReadQueryResult } from '../../analysis/queries/InboxReadQuery';
import { useKeyPress } from '../../hooks/useKeyPress';
import { logEvent } from '../../utils/analytics';
import { typeMessageToPhoneNumber } from '../../utils/appleScriptCommands';

enum InboxConversationStatuses {
  'AWAITING_ACTION' = 'AWAITING_ACTION',
  'REMIND_ME' = 'REMIND_ME',
  'REPLY_NOW' = 'REPLY_NOW',
  'DONE' = 'DONE',
}

type TConversation = {
  chatId: string;
  name: string;
  status: InboxConversationStatuses;
  messages: {
    friend: string;
    message: string;
    date: Date;
  }[];
};

export function MessageInbox() {
  const [conversations, setConversations] = useState<TConversation[]>([]);
  const [currentConversationIndex, setCurrentConversationIndex] =
    useState<number>(0);
  const [selectedConversationStatus, setSelectedConversationStatus] =
    useState<InboxConversationStatuses>();

  const [isInboxZero, setIsInboxZero] = useState<boolean>(false);
  const [upActive, setUpActive] = useState<boolean>(false);
  const [downActive, setDownActive] = useState<boolean>(false);
  const [remindMeActive, setRemindMeActive] = useState<boolean>(false);
  const [replyNowActive, setReplyNowActive] = useState<boolean>(false);
  const [doneActive, setDoneActive] = useState<boolean>(false);

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();
  const toastIdRef = useRef<any>();

  useEffect(() => {
    async function fetchMessageInbox() {
      setError('');
      setIsLoading(true);
      try {
        const data: InboxReadQueryResult[] = await ipcRenderer.invoke(
          'query-inbox'
        );

        const conversationsByChatId: Record<string, TConversation> = {};
        // transform the data into format we want
        data.forEach((m) => {
          const {
            chat_id,
            contact_name,
            is_from_me,
            message,
            human_readable_date,
          } = m;

          const msg = {
            friend: is_from_me === 0 ? contact_name : 'you',
            message,
            date: new Date(human_readable_date),
          };
          // first time seeing this chat
          if (!conversationsByChatId[chat_id]) {
            const conversation = {
              name: contact_name,
              chatId: chat_id,
              // TODO: read this from DB
              status: InboxConversationStatuses.AWAITING_ACTION,
              messages: [msg],
            };
            conversationsByChatId[chat_id] = conversation;
          } else {
            conversationsByChatId[chat_id].messages.push(msg);
          }
        });

        // look at the last messages and sort by priority
        // 1) last text not you
        // 2) last text you with a question

        const c = Object.values(conversationsByChatId);
        setConversations(c);
        if (c.length > 0) {
          setSelectedConversationStatus(c[0].status);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for Message Inbox`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMessageInbox();
  }, []);

  const bottomOfConversationThreadRef = useRef(null);
  useEffect(() => {
    if (
      bottomOfConversationThreadRef &&
      bottomOfConversationThreadRef.current
    ) {
      // @ts-ignore
      bottomOfConversationThreadRef.current.scrollIntoView({
        block: 'nearest',
        inline: 'start',
      });
    }
  });

  const numConversationsAwaitingAction = conversations.filter(
    (c) => c.status === InboxConversationStatuses.AWAITING_ACTION
  ).length;

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const moveDownConversationStack = () => {
    const tmp = [...conversations];
    tmp.splice(currentConversationIndex, 1); // 2nd parameter means remove one item only
    setConversations(tmp);

    const proposedIndex = currentConversationIndex + 1;
    if (proposedIndex > conversations.length - 1) {
      const remainingAwaiting = conversations.findIndex(
        (c) => c.status === InboxConversationStatuses.AWAITING_ACTION
      );
      setIsInboxZero(true);
      // TODO(Danilowicz): do this when we actual persist the valuess
      // if (remainingAwaiting === -1) {
      //   setIsInboxZero(true);
      // }
      // proposedIndex = remainingAwaiting;
    } else {
      setCurrentConversationIndex(proposedIndex);
      setSelectedConversationStatus(conversations[proposedIndex].status);
    }
  };

  const moveUpConversationStack = () => {
    const proposedIndex = currentConversationIndex - 1;
    if (proposedIndex < 0) {
      return;
    }
    setCurrentConversationIndex(proposedIndex);
    setSelectedConversationStatus(conversations[proposedIndex].status);
  };

  const onClickUp = () => {
    closeToast();
    setUpActive(true);
    moveUpConversationStack();
    setTimeout(() => {
      setUpActive(false);
    }, 200);
  };

  const onClickDown = () => {
    closeToast();
    setDownActive(true);
    moveDownConversationStack();
    setTimeout(() => {
      setDownActive(false);
    }, 200);
  };

  const onClickRemindMe = () => {
    closeToast();
    setRemindMeActive(true);
    setSelectedConversationStatus(InboxConversationStatuses.REMIND_ME);

    setTimeout(() => {
      setRemindMeActive(false);
    }, 200);

    toastIdRef.current = toast({
      // store previous conversation index
      title: `Marked conversation with ${conversations[currentConversationIndex].name} as remind me`,
      duration: 5000,
      position: 'bottom-right',
      variant: 'subtle',
    });

    moveDownConversationStack();
  };

  const onClickReplyNow = async () => {
    closeToast();
    setReplyNowActive(true);
    setSelectedConversationStatus(InboxConversationStatuses.REPLY_NOW);
    setTimeout(() => {
      setReplyNowActive(false);
    }, 200);

    toastIdRef.current = toast({
      // store previous conversation index
      title: `Marked conversation with ${conversations[currentConversationIndex].name} as responded`,
      status: 'info',
      duration: 5000,
      position: 'bottom-right',
    });

    await typeMessageToPhoneNumber({
      message: 'Hey, meant to follow up on this earlier!',
      // NOTE(Danilowicz): if we get reports of this not working,
      // we should use the phone number here, which might have a
      // a higher success rate
      phoneNumber: conversations[currentConversationIndex].name,
    });

    logEvent({
      eventName: 'CLICKED_REPLY_NOW',
    });

    moveDownConversationStack();
  };

  const onClickDone = () => {
    closeToast();
    setDoneActive(true);
    setSelectedConversationStatus(InboxConversationStatuses.DONE);

    setTimeout(() => {
      setDoneActive(false);
    }, 200);

    toastIdRef.current = toast({
      title: `Marked conversation with ${conversations[currentConversationIndex].name} as done`,
      status: 'success',
      duration: 5000,
      position: 'bottom-right',
    });

    logEvent({
      eventName: 'CLICKED_DONE',
    });

    moveDownConversationStack();
  };

  useKeyPress(['f'], onClickDone);
  useKeyPress(['d'], onClickReplyNow);
  useKeyPress(['s'], onClickRemindMe);
  useKeyPress(['q'], onClickUp);
  useKeyPress(['a'], onClickDown);

  if (isLoading || conversations.length === 0) {
    return (
      <>
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            left: 100,
          }}
        >
          <Spinner color="purple.400" size="xl" />
        </div>
      </>
    );
  }

  // TODO(Danilowicz): handle error too
  // if (error)

  let statusMessage;
  if (
    selectedConversationStatus === InboxConversationStatuses.AWAITING_ACTION
  ) {
    statusMessage = (
      <>
        <Text>Status:</Text>
        <Text ml="1" mr="1" color="red.400" fontWeight="bold">
          Awaiting Action
        </Text>
      </>
    );
  }

  if (selectedConversationStatus === InboxConversationStatuses.REMIND_ME) {
    statusMessage = (
      <>
        <Text mr="1">Status: Remind Me</Text>
        <FiClock />
      </>
    );
  }

  if (selectedConversationStatus === InboxConversationStatuses.REPLY_NOW) {
    statusMessage = (
      <>
        <Text mr="1">Status: Reply Now</Text>
        <FiArrowRightCircle />
      </>
    );
  }

  if (selectedConversationStatus === InboxConversationStatuses.DONE) {
    statusMessage = (
      <>
        <Text mr="1">Status: Done</Text>
        <FiCheck />
      </>
    );
  }

  const iconSize = 55;
  return (
    <>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <Text fontSize="4xl">{`Your Inbox (${numConversationsAwaitingAction})`}</Text>
        {/* <Button leftIcon={<Icon as={FiRefreshCw} />} onClick={() => {}}>
          Refresh Data
        </Button> */}
      </Box>

      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 30,
        }}
      >
        <Text fontSize="lg" mb={1}>
          Jump to any thread
        </Text>
        <div style={{ width: '40%' }}>
          <Select
            value={{
              label: conversations[currentConversationIndex].name,
              value: conversations[currentConversationIndex].chatId,
            }}
            options={conversations.map((c) => {
              return {
                value: c.chatId,
                label: c.name,
              };
            })}
            onChange={(e) => {
              if (e) {
                const proposedIndex = conversations.findIndex(
                  (c) => c.chatId === e.value
                );
                if (proposedIndex !== -1) {
                  setCurrentConversationIndex(proposedIndex);
                }
              }
            }}
          />
        </div>
      </Box>
      <Box borderWidth="1px" borderRadius="lg" minHeight={550}>
        {!isInboxZero ? (
          <>
            <Text textAlign="center" fontSize="4xl" paddingTop={10}>
              {conversations[currentConversationIndex].name}
            </Text>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              mb={25}
            >
              {statusMessage}
            </Box>

            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  marginRight: '100px',
                }}
              >
                <IconButton
                  isActive={upActive}
                  onClick={onClickUp}
                  isDisabled={currentConversationIndex === 0}
                  colorScheme="gray"
                  aria-label="Up"
                  size="lg"
                  icon={<FiChevronUp />}
                  fontSize={iconSize - 25}
                  w={iconSize}
                  h={iconSize}
                />
                <IconButton
                  isActive={downActive}
                  onClick={onClickDown}
                  colorScheme="gray"
                  aria-label="Up"
                  size="lg"
                  icon={<FiChevronDown />}
                  fontSize={iconSize - 25}
                  w={iconSize}
                  h={iconSize}
                />
              </Box>
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '300px',
                  overflow: 'auto',
                  border: `1px solid ${theme.colors.gray['200']}`,
                  borderRadius: 16,
                  padding: 15,
                  marginLeft: '-50px',
                  maxWidth: '650px',
                }}
              >
                {/* {showConfetti && (
                  <Confetti
                    width={440}
                    height={350}
                    recycle={false}
                    numberOfPieces={200}
                    onConfettiComplete={() => {
                      setShowConfetti(false);
                    }}
                  />
                )} */}
                {conversations[currentConversationIndex].messages.map((c) => {
                  let marginLeft = '0px';
                  if (c.friend === 'you') {
                    marginLeft = '350px';
                  }
                  return (
                    <Box
                      marginBottom="5px"
                      marginTop="5px"
                      marginLeft={marginLeft}
                      key={c.message}
                      style={{
                        border: `1px solid ${theme.colors.gray['200']}`,
                        padding: 25,
                        borderRadius: 16,
                      }}
                    >
                      <Text color="gray.500" fontSize={14}>
                        From{' '}
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: theme.colors.blue['400'],
                          }}
                        >
                          {c.friend}
                        </span>
                        <span style={{ margin: '0 6px' }}>on</span>
                        <span style={{ fontWeight: 'bold' }}>
                          {new Date(c.date).toLocaleString()}
                        </span>
                      </Text>

                      <Text style={{ marginTop: 8 }}>{c.message}</Text>
                    </Box>
                  );
                })}
                <div ref={bottomOfConversationThreadRef} />
              </Box>
            </Box>

            <Box
              style={{
                marginTop: 50,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              {/* <Button
                onClick={onClickRemindMe}
                isActive={remindMeActive}
                rightIcon={<FiClock />}
              >
                Remind Me
              </Button> */}
              <Button
                onClick={onClickReplyNow}
                isActive={replyNowActive}
                rightIcon={<FiArrowRightCircle />}
                colorScheme="blue"
              >
                Reply Now
              </Button>
              <Button
                onClick={onClickDone}
                isActive={doneActive}
                rightIcon={<FiCheck />}
                colorScheme="green"
              >
                Done
              </Button>
            </Box>
            <Text
              mt={5}
              mb={5}
              fontSize={14}
              textAlign="center"
              color="gray.500"
            >{`${numConversationsAwaitingAction} conversation${
              numConversationsAwaitingAction < 2 ? '' : 's'
            } awaiting action`}</Text>
          </>
        ) : (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            minHeight={550}
          >
            <Text
              bgGradient="linear(to-br, #0047AB, #6495ED)"
              bgClip="text"
              textAlign="center"
              fontSize={65}
              fontWeight="extrabold"
            >
              Inbox zero
            </Text>
            <Text ml={5} fontSize={65}>
              🎉
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
}