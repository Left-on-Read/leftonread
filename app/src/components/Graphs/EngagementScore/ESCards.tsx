import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Skeleton,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  theme as defaultTheme,
} from '@chakra-ui/react';
import { EngagementResult } from 'analysis/queries/EngagementQueries';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { useGoldContext } from '../../Premium/GoldContext';

type CardType = 'DOUBLE_TEXTS' | 'AVG_LENGTH' | 'LEFT_ON_READ' | 'AVG_DELAY';

const formatSeconds = (seconds: number) => {
  if (seconds < 300) {
    return [`${seconds.toLocaleString()}`, 'seconds'];
  }

  const minutes = seconds / 60;
  if (minutes < 150) {
    return [`${minutes.toLocaleString()}`, 'minutes'];
  }

  const hours = minutes / 60;
  if (hours < 100) {
    return [`${hours.toLocaleString()}`, 'hours'];
  }

  const days = hours / 24;

  return [`${days.toLocaleString()}`, 'days'];
};

function Card({
  cardType,
  isLoading,
  data,
  error,
}: {
  cardType: CardType;
  isLoading: boolean;
  data: EngagementResult[];
  error: string | null;
}) {
  const sentResults = data.filter((pt) => pt.isFromMe === 1);
  const receivedResults = data.filter((pt) => pt.isFromMe === 0);

  const sent =
    sentResults.length > 0 ? sentResults[0] : { isFromMe: 1, value: 0 };
  const received =
    receivedResults.length > 0 ? receivedResults[0] : { isFromMe: 0, value: 0 };

  let title = '';
  let backgroundColor = defaultTheme.colors.purple;
  let sentLabel = '';
  let receivedLabel = '';
  let sentHelperText = 'messages';
  let receivedHelperText = 'messages';

  if (cardType === 'DOUBLE_TEXTS') {
    title = 'Double Texts';
    backgroundColor = defaultTheme.colors.cyan;
    sentLabel = sent.value.toLocaleString();
    receivedLabel = received.value.toLocaleString();
  } else if (cardType === 'AVG_LENGTH') {
    title = 'Average Message Length';
    backgroundColor = defaultTheme.colors.orange;
    sentLabel = sent.value.toLocaleString();
    receivedLabel = received.value.toLocaleString();
    sentHelperText = 'characters';
    receivedHelperText = 'characters';
  } else if (cardType === 'LEFT_ON_READ') {
    title = 'Messages Left on Read';
    backgroundColor = defaultTheme.colors.pink;
    sentLabel = sent.value.toLocaleString();
    receivedLabel = received.value.toLocaleString();
  } else if (cardType === 'AVG_DELAY') {
    title = 'Average Response Time';
    backgroundColor = defaultTheme.colors.purple;
    [sentLabel, sentHelperText] = formatSeconds(sent.value);
    [receivedLabel, receivedHelperText] = formatSeconds(received.value);
  }

  if (error) {
    return (
      <Box
        style={{
          height: '100%',
          width: '100%',
          borderRadius: 16,
          backgroundColor: backgroundColor['50'],
          padding: 32,
          border: `1px solid ${backgroundColor['200']}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        shadow="xl"
      >
        <Text color="red.400">Uh oh! Something went wrong... </Text>
      </Box>
    );
  }

  return (
    <Box
      style={{
        height: '100%',
        width: '100%',
        borderRadius: 16,
        backgroundColor: backgroundColor['50'],
        padding: 32,
        border: `1px solid ${backgroundColor['200']}`,
      }}
      shadow="xl"
    >
      {isLoading ? (
        <Skeleton height={8} width={180} />
      ) : (
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
      )}
      <div
        style={{
          width: '100%',
          marginTop: 16,
        }}
      >
        <StatGroup
          style={{
            width: '100%',
          }}
        >
          <Stat>
            <StatLabel>Sent</StatLabel>

            <StatNumber>
              {isLoading ? <Skeleton height={8} width={65} /> : sentLabel}
            </StatNumber>
            <StatHelpText>{sentHelperText}</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Received</StatLabel>
            <StatNumber>
              {isLoading ? <Skeleton height={8} width={65} /> : receivedLabel}
            </StatNumber>
            <StatHelpText>{receivedHelperText}</StatHelpText>
          </Stat>
        </StatGroup>
      </div>
    </Box>
  );
}

const CARD_OFFSET = 10;
const SCALE_FACTOR = 0.06;

const CARD_TYPES: CardType[] = [
  'DOUBLE_TEXTS',
  'AVG_LENGTH',
  'LEFT_ON_READ',
  'AVG_DELAY',
];
const HEIGHT = `200px`;
const WIDTH = `350px`;

export function ESCards({
  isLoading,
  avgLengthResults,
  doubleTextResults,
  leftonreadResults,
  avgDelayResults,
  error,
}: {
  isLoading: boolean;
  avgLengthResults: EngagementResult[];
  doubleTextResults: EngagementResult[];
  leftonreadResults: EngagementResult[];
  avgDelayResults: EngagementResult[];
  error: string | null;
}) {
  const { isPremium } = useGoldContext();

  const [cards, setCards] = useState<CardType[]>(CARD_TYPES);

  const moveToEnd = (index: number) => {
    const newCards = [...cards];
    const toMove = newCards[index];
    newCards.splice(index, 1);
    newCards.push(toMove);
    setCards(newCards);
  };

  const moveToFront = (index: number) => {
    const newCards = [...cards];
    const toMove = newCards[index];
    newCards.splice(index, 1);
    newCards.unshift(toMove);
    setCards(newCards);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        icon={<ChevronLeftIcon />}
        aria-label="Left"
        onClick={() => moveToFront(cards.length - 1)}
        tabIndex={-1}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: HEIGHT,
          margin: '0 16px',
        }}
      >
        <ul
          style={{
            position: 'relative',
            width: WIDTH,
            height: HEIGHT,
          }}
        >
          {cards.map((cardType, index) => {
            let data: EngagementResult[] = [];
            if (cardType === 'AVG_LENGTH') {
              data = avgLengthResults;
            } else if (cardType === 'DOUBLE_TEXTS') {
              data = doubleTextResults;
            } else if (cardType === 'LEFT_ON_READ') {
              data = leftonreadResults;
            } else if (cardType === 'AVG_DELAY') {
              data = avgDelayResults;
            }

            return (
              <motion.li
                key={cardType}
                style={{
                  position: 'absolute',
                  width: WIDTH,
                  height: HEIGHT,
                  borderRadius: '8px',
                  transformOrigin: 'top center',
                  listStyle: 'none',
                }}
                animate={{
                  top: index * -CARD_OFFSET,
                  scale: 1 - index * SCALE_FACTOR,
                  zIndex: CARD_TYPES.length - index,
                }}
                //   drag={canDrag ? 'y' : false}
                dragConstraints={{
                  top: 0,
                  bottom: 0,
                }}
                onDragEnd={() => moveToEnd(index)}
              >
                <Card
                  cardType={cardType}
                  isLoading={isLoading}
                  data={data}
                  error={error}
                />
              </motion.li>
            );
          })}
        </ul>
      </div>
      <IconButton
        icon={<ChevronRightIcon />}
        aria-label="Right"
        onClick={() => moveToEnd(0)}
        tabIndex={-1}
      />
    </div>
  );
}
