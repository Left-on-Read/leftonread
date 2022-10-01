/* eslint-disable @typescript-eslint/naming-convention */
import {
  Box,
  Button,
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
} from 'react-icons/fi';
import Select from 'react-select';

import {
  InboxConversationStatuses,
  InboxReadQueryResult,
} from '../../analysis/queries/InboxReadQuery';
import { useKeyPress } from '../../hooks/useKeyPress';
import { logEvent } from '../../utils/analytics';
import { typeMessageToPhoneNumber } from '../../utils/appleScriptCommands';

type TConversation = {
  chatId: string;
  name: string;
  status: InboxConversationStatuses;
  messages: {
    friend: string;
    message: string;
    date: Date;
    messageId: number;
  }[];
};

export function MessageInbox() {
  const [chatIds, setChatIds] = useState<
    {
      chat_id: string;
      contact_name: string;
    }[]
  >([]);
  const [count, setCount] = useState<number>(0);
  const [conversation, setConversation] = useState<TConversation[]>([]);
  const [currentChatIndex, setCurrentChatIndex] = useState<number>(0);

  const [isInboxZero, setIsInboxZero] = useState<boolean>(false);
  const [upActive, setUpActive] = useState<boolean>(false);
  const [downActive, setDownActive] = useState<boolean>(false);
  const [replyNowActive, setReplyNowActive] = useState<boolean>(false);
  const [doneActive, setDoneActive] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();
  const toastIdRef = useRef<any>();

  useEffect(() => {
    async function fetchConversation() {
      const conversationData: InboxReadQueryResult[] = await ipcRenderer.invoke(
        'query-inbox-read',
        chatIds[currentChatIndex].chat_id
      );
      const conversationByChatId: Record<string, TConversation> = {};
      // transform the data into format we want
      conversationData.forEach((m) => {
        const {
          chat_id,
          contact_name,
          is_from_me,
          message,
          human_readable_date,
          message_id,
        } = m;

        const msg = {
          friend: is_from_me === 0 ? contact_name : 'you',
          message,
          date: new Date(human_readable_date),
          messageId: message_id,
        };
        if (contact_name.length > 0) {
          // first time seeing this chat
          if (!conversationByChatId[chat_id]) {
            const cns = {
              name: contact_name,
              chatId: chat_id,
              status: InboxConversationStatuses.AWAITING_ACTION,
              messages: [msg],
            };
            conversationByChatId[chat_id] = cns;
          } else {
            conversationByChatId[chat_id].messages.push(msg);
          }
        }
      });
      setConversation(Object.values(conversationByChatId));
    }
    if (chatIds.length > 0) {
      fetchConversation();
    }
  }, [chatIds, currentChatIndex]);

  useEffect(() => {
    async function fetchChatIds() {
      setIsLoading(true);
      try {
        const chatIdData: { chat_id: string; contact_name: string }[] =
          await ipcRenderer.invoke('query-inbox-chat-ids');
        console.log(chatIdData);
        if (chatIdData.length > 0) {
          setChatIds(chatIdData);
          setCount(chatIdData.length);
          setCurrentChatIndex(0);
        } else {
          console.log('this is hapening');
          setIsInboxZero(true);
        }
      } catch (err: unknown) {
        log.error(`ERROR: fetching for Message Inbox`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChatIds();
  }, []);

  const writeConversationStatusToInbox = async ({
    chatId,
  }: // status,
  {
    chatId: string;
    // status: InboxConversationStatuses;
  }) => {
    await ipcRenderer.invoke('query-inbox-write', chatId);
    setCount(count - 1);
  };

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

  const numConversationsAwaitingAction = count;

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const moveDownConversationStack = () => {
    const proposedIndex = currentChatIndex + 1;
    // TODO: defensive check?
    setCurrentChatIndex(proposedIndex);
  };

  const moveUpConversationStack = () => {
    const proposedIndex = currentChatIndex - 1;
    if (proposedIndex < 0) {
      return;
    }
    setCurrentChatIndex(proposedIndex);
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

  const onClickReplyNow = async () => {
    writeConversationStatusToInbox({
      chatId: chatIds[currentChatIndex].chat_id,
    });
    closeToast();
    setReplyNowActive(true);
    setTimeout(() => {
      setReplyNowActive(false);
    }, 200);

    toastIdRef.current = toast({
      // store previous conversation index
      title: `Marked conversation with ${chatIds[currentChatIndex].contact_name} as responded`,
      status: 'info',
      duration: 5000,
      position: 'bottom-right',
    });

    await typeMessageToPhoneNumber({
      message: 'Hey, meant to follow up on this earlier!',
      // NOTE(Danilowicz): if we get reports of this not working,
      // we should use the phone number here, which might have a
      // a higher success rate
      phoneNumber: chatIds[currentChatIndex].contact_name,
    });

    logEvent({
      eventName: 'CLICKED_REPLY_NOW',
    });

    moveDownConversationStack();
  };

  const onClickDone = () => {
    writeConversationStatusToInbox({
      chatId: chatIds[currentChatIndex].chat_id,
    });
    closeToast();
    setDoneActive(true);

    setTimeout(() => {
      setDoneActive(false);
    }, 200);

    toastIdRef.current = toast({
      title: `Marked conversation with ${chatIds[currentChatIndex].contact_name} as done`,
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
  useKeyPress(['q'], onClickUp);
  useKeyPress(['a'], onClickDown);

  if (
    isLoading ||
    (!isInboxZero && chatIds.length === 0) ||
    (!isInboxZero && conversation.length === 0)
  ) {
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

  const iconSize = 55;

  return (
    <>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text fontSize="4xl">{`Your Inbox (${numConversationsAwaitingAction})`}</Text>
        {!isInboxZero && (
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 30,
            }}
          >
            <Text fontSize="lg" mb={1}>
              Jump to any thread...
            </Text>
            <div>
              <Select
                value={{
                  value: chatIds[currentChatIndex].chat_id,
                  label: chatIds[currentChatIndex].contact_name,
                }}
                options={chatIds.map((v) => {
                  return {
                    value: v.chat_id,
                    label: v.contact_name,
                  };
                })}
                onChange={(e) => {
                  if (e) {
                    const proposedIndex = chatIds.findIndex(
                      (c) => c.chat_id.toString() === e.value.toString()
                    );
                    if (proposedIndex !== -1) {
                      setCurrentChatIndex(proposedIndex);
                    }
                  }
                }}
              />
            </div>
          </Box>
        )}
      </Box>

      <Box borderWidth="1px" borderRadius="lg" minHeight={550}>
        {!isInboxZero && !isLoading ? (
          <>
            <Text textAlign="center" fontSize="4xl" paddingTop={10}>
              {chatIds[currentChatIndex].contact_name}
            </Text>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              mb={25}
            >
              <Text>Status:</Text>
              <Text ml="1" mr="1" color="red.400" fontWeight="bold">
                Awaiting Action
              </Text>
            </Box>

            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              {/* <Box
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
                  visibility={currentChatIndex === 0 ? 'hidden' : undefined}
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
              </Box> */}
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '200px',
                  overflow: 'auto',
                  border: `1px solid ${theme.colors.gray['200']}`,
                  borderRadius: 16,
                  padding: 15,
                  maxWidth: '650px',
                }}
              >
                {conversation[0].messages.map((c) => {
                  let marginLeft = '0px';
                  if (c.friend === 'you') {
                    marginLeft = '350px';
                  }
                  return (
                    <Box
                      marginBottom="5px"
                      marginTop="5px"
                      marginLeft={marginLeft}
                      key={c.messageId}
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
                marginTop: 25,
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
              fontSize={45}
              fontWeight="extrabold"
            >
              You have no messages awaiting action right now.
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
}
