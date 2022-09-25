import { Box, Button, Icon, IconButton, Text, theme } from '@chakra-ui/react';
import { useKeyPress } from 'hooks/useKeyPress';
import { useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import {
  FiArrowRightCircle,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiRefreshCw,
} from 'react-icons/fi';
import Select from 'react-select';

enum InboxConversationStatuses {
  'AWAITING_ACTION' = 'AWAITING_ACTION',
  'REMIND_ME' = 'REMIND_ME',
  'REPLY_NOW' = 'REPLY_NOW',
  'DONE' = 'DONE',
}

const fakeData = [
  {
    name: 'Teddy Ni',
    status: InboxConversationStatuses.AWAITING_ACTION,
    messages: [
      { friend: 'Teddy Ni', message: 'Hi, how is it going?', date: new Date() },
      { friend: 'you', message: 'it is going', date: new Date() },
      {
        friend: 'Teddy Ni',
        message: 'cool u wanna go to movies',
        date: new Date(),
      },
    ],
  },
  {
    name: 'Joe Smith',
    status: InboxConversationStatuses.AWAITING_ACTION,
    messages: [
      { friend: 'Joe Smith', message: 'hola amigo', date: new Date() },
      { friend: 'you', message: 'hey whatup', date: new Date() },
    ],
  },
  {
    name: 'Ricardo Lopez',
    status: InboxConversationStatuses.AWAITING_ACTION,
    messages: [
      {
        friend: 'you',
        message: 'wanna get dinner in like 2 weeks',
        date: new Date(),
      },
      {
        friend: 'you',
        message: 'hey following up on dinner?',
        date: new Date(),
      },
      {
        friend: 'Ricardo Lopez',
        message: 'wasssup',
        date: new Date(),
      },
      {
        friend: 'you',
        message:
          'hey here is a super long text message i like dogs i love dogs i love cats i love turtles',
        date: new Date(),
      },
    ],
  },
  {
    name: 'Britney Gonzales',
    status: InboxConversationStatuses.AWAITING_ACTION,
    messages: [
      {
        friend: 'Britney Gonzales',
        message: 'did u see radiohead',
        date: new Date(),
      },
      {
        friend: 'you',
        message: 'yay',
        date: new Date(),
      },
      {
        friend: 'Britney Gonzales',
        message: 'dats awesome',
        date: new Date(),
      },
      {
        friend: 'you',
        message: 'thanks',
        date: new Date(),
      },
      {
        friend: 'Britney Gonzales',
        message: 'ok byeeeee',
        date: new Date(),
      },
    ],
  },
];

export function MessageInbox() {
  const [conversations, setConversations] = useState<
    {
      name: string;
      status: InboxConversationStatuses;
      messages: {
        friend: string;
        message: string;
        date: Date;
      }[];
    }[]
  >(fakeData);
  const [currentConversationIndex, setCurrentConversationIndex] =
    useState<number>(0);

  const [selectedConversationStatus, setSelectedConversationStatus] =
    useState<InboxConversationStatuses>(
      conversations[currentConversationIndex].status
    );

  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const [isInboxZero, setIsInboxZero] = useState<boolean>(false);
  const [upActive, setUpActive] = useState<boolean>(false);
  const [downActive, setDownActive] = useState<boolean>(false);
  const [remindMeActive, setRemindMeActive] = useState<boolean>(false);
  const [replyNowActive, setReplyNowActive] = useState<boolean>(false);
  const [doneActive, setDoneActive] = useState<boolean>(false);

  const numConversationsAwaitingAction = conversations.filter(
    (c) => c.status === InboxConversationStatuses.AWAITING_ACTION
  ).length;

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

  const moveDownConversationStack = () => {
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
    setUpActive(true);
    moveUpConversationStack();
    setTimeout(() => {
      setUpActive(false);
    }, 200);
  };

  const onClickDown = () => {
    setDownActive(true);
    moveDownConversationStack();
    setTimeout(() => {
      setDownActive(false);
    }, 200);
  };

  const onClickRemindMe = () => {
    setRemindMeActive(true);
    setSelectedConversationStatus(InboxConversationStatuses.REMIND_ME);

    setTimeout(() => {
      setRemindMeActive(false);
    }, 200);

    moveDownConversationStack();
  };

  const onClickReplyNow = () => {
    setReplyNowActive(true);
    setSelectedConversationStatus(InboxConversationStatuses.REPLY_NOW);

    setTimeout(() => {
      setReplyNowActive(false);
    }, 200);

    moveDownConversationStack();
  };

  const onClickDone = () => {
    setDoneActive(true);
    setSelectedConversationStatus(InboxConversationStatuses.DONE);

    setTimeout(() => {
      setDoneActive(false);
    }, 200);

    moveDownConversationStack();

    setShowConfetti(true);
  };

  useKeyPress(['f'], onClickDone);
  useKeyPress(['d'], onClickReplyNow);
  useKeyPress(['s'], onClickRemindMe);
  useKeyPress(['q'], onClickUp);
  useKeyPress(['a'], onClickDown);

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
        <Button leftIcon={<Icon as={FiRefreshCw} />} onClick={() => {}}>
          Refresh Data
        </Button>
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
          <Select options={[{ value: 'Teddy Ni', label: 'Teddy Ni' }]} />
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
              <Button
                onClick={onClickRemindMe}
                isActive={remindMeActive}
                rightIcon={<FiClock />}
                colorScheme="blue"
              >
                Remind Me
              </Button>
              <Button
                onClick={onClickReplyNow}
                isActive={replyNowActive}
                rightIcon={<FiArrowRightCircle />}
                colorScheme="purple"
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
