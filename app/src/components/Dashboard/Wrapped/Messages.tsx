import cn from 'classnames';
import { randomUUID } from 'crypto';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import styles from '../../messages.module.scss';

// Samuel Kraft is a legend
// https://samuelkraft.com/blog/ios-chat-bubbles-css
// https://github.com/samuelkraft/samuelkraft-next/blob/master/components/animatedmessages.tsx

function useInterval(callback: any, delay: any) {
  const savedCallback = useRef<any>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay]);
}

const initialMessages = [{ text: '', sent: false, id: randomUUID() }];

const transition = {
  type: 'spring',
  stiffness: 200,
  mass: 0.2,
  damping: 20,
};

const variants = {
  initial: {
    opacity: 0,
    y: 300,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition,
  },
};

export const Messages = (): JSX.Element => {
  const [messages, setMessages] = useState(initialMessages);

  useInterval(() => {
    setMessages((curr) => {
      if (curr.length % 2 === 0) {
        curr.push({ text: '', sent: false, id: randomUUID() });
      } else {
        curr.push({ text: '', sent: true, id: randomUUID() });
      }
      return [...curr];
    });
  }, 300);

  return (
    <AnimatePresence>
      <ol className={styles.list}>
        {messages.map(({ text, sent, id }, i) => {
          const isLast = i === messages.length - 1;
          const noTail = !isLast && messages[i + 1]?.sent === sent;
          return (
            <motion.li
              key={id}
              className={cn(
                styles.shared,
                sent ? styles.sent : styles.received,
                noTail && styles.noTail
              )}
              initial="initial"
              animate="enter"
              variants={variants}
              layout
              style={{ minWidth: '150px', minHeight: '40px' }}
            >
              {text}
            </motion.li>
          );
        })}
      </ol>
    </AnimatePresence>
  );
};
