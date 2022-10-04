/* eslint-disable prefer-destructuring */
import { Box, Text, theme } from '@chakra-ui/react';
import { TopFriendsSimpleResult } from 'analysis/queries/WrappedQueries/TopFriendsSimpleQuery';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect } from 'react';

import { TimerBar } from '../TimerBar';

const sectionDurationInSecs = 8;

export function MostMessages({
  shouldExit,
  onExitFinish,
  topFriends,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
  topFriends: TopFriendsSimpleResult;
}) {
  const controls = useAnimationControls();

  let secondFriend = 'Steve Jobs';
  let thirdFriend = 'Bill Gates';
  let fourthFriend = 'Oprah';
  let fifthFriend = 'Beyonce';
  let sixthFriend = 'Jeremy Lin';
  if (topFriends.length > 9) {
    secondFriend = topFriends[5].friend;
    thirdFriend = topFriends[6].friend;
    fourthFriend = topFriends[7].friend;
    fifthFriend = topFriends[8].friend;
    sixthFriend = topFriends[4].friend;
  }

  const animateExit = useCallback(() => {
    controls.stop();
    controls.start({
      opacity: 0,
    });
  }, [controls]);

  useEffect(() => {
    const timeoutOne = setTimeout(() => {
      animateExit();
    }, (sectionDurationInSecs - 1) * 1000);

    const timeoutTwo = setTimeout(() => {
      onExitFinish();
    }, sectionDurationInSecs * 1000);

    return () => {
      clearTimeout(timeoutOne);
      clearTimeout(timeoutTwo);
    };
  }, [animateExit, onExitFinish]);

  useEffect(() => {
    setTimeout(() => {
      controls.start({
        opacity: 1,
      });
    }, 200);
  }, [controls]);

  useEffect(() => {
    if (shouldExit) {
      animateExit();
    }
  }, [animateExit, shouldExit]);

  return (
    <Box
      height="100%"
      width="100%"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5vh',
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
      shadow="dark-lg"
      bgColor="purple.50"
    >
      <TimerBar durationInSecs={sectionDurationInSecs} />
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={controls}
        style={{ lineHeight: 1.2, display: 'flex', justifyContent: 'center' }}
      >
        <Text fontSize="3xl" fontWeight="bold" style={{ textAlign: 'center' }}>
          These messages seem to be going to a select few friends...
        </Text>
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '4vh',
          left: '2vh',
          fontWeight: 'bold',
          color: 'gray',
          fontSize: 36,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          delay: 1,
        }}
      >
        {secondFriend}
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '15vh',
          right: '5vh',
          fontWeight: 'bold',
          color: 'gray',
          opacity: 0.4,
          fontSize: 36,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          delay: 2,
        }}
      >
        {thirdFriend}
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          top: '13vh',
          right: '-8vh',
          fontWeight: 'bold',
          color: 'gray',
          opacity: 0.4,
          fontSize: 36,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          delay: 2.5,
        }}
      >
        {fourthFriend}
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          top: '5vh',
          left: '-8vh',
          fontWeight: 'bold',
          color: 'gray',
          opacity: 0.4,
          fontSize: 36,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          delay: 3,
        }}
      >
        {fifthFriend}
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '6vh',
          left: '1.5vh',
          fontWeight: 'bold',
          color: 'gray',
          fontSize: 36,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          delay: 4,
        }}
      >
        {sixthFriend}
      </motion.div>
    </Box>
  );
}
