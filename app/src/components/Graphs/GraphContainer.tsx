import {
  Box,
  Button,
  Icon,
  Text,
  theme as defaultTheme,
} from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';
import { FiPlus, FiRefreshCw, FiShare } from 'react-icons/fi';

import { logEvent } from '../../utils/analytics';
import { useGlobalContext } from '../Dashboard/GlobalContext';
import { UnlockPremiumButton } from '../Premium/UnlockPremiumButton';

export function GraphContainer({
  title,
  description,
  icon,
  children,
  tooltip,
  isPremiumGraph,
  onClickMessageScheduler,
  onClickMessageSchedulerRefresh,
  setIsShareOpen,
  showGroupChatShareButton,
}: {
  title: string[];
  description?: string;
  icon: IconType;
  children: React.ReactNode;
  tooltip?: React.ReactNode;
  isPremiumGraph?: boolean;
  onClickMessageScheduler?: () => void;
  onClickMessageSchedulerRefresh?: () => void;
  setIsShareOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  showGroupChatShareButton?: boolean;
}) {
  const { isPremium } = useGlobalContext();

  const isLocked = isPremiumGraph && !isPremium;

  return (
    <>
      <div style={{ margin: '12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Box
            style={{
              marginRight: 12,
              border: `1px ${defaultTheme.colors.gray['500']} solid`,
              borderRadius: '50%',
              padding: 8,
              width: 40,
              height: 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            boxShadow="lg"
          >
            <Icon
              as={icon}
              color="gray.500"
              style={{ width: '80%', height: '80%' }}
            />
          </Box>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text fontSize="lg" fontWeight={600}>
                  {title}
                </Text>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: showGroupChatShareButton ? '25px' : undefined,
                }}
              >
                <Text fontSize="sm" color="gray">
                  {description}
                </Text>
                <span style={{ marginLeft: '10px' }}>{tooltip}</span>
              </div>
            </div>

            {!isLocked && setIsShareOpen && (
              <Button
                style={{
                  padding: showGroupChatShareButton ? '0px 30px' : undefined,
                }}
                onClick={() => {
                  setIsShareOpen(true);
                  logEvent({
                    eventName: 'SHARE_GRAPH',
                    properties: {
                      graph: title[0],
                    },
                  });
                }}
                leftIcon={<Icon as={FiShare} />}
              >
                {showGroupChatShareButton ? 'Share with group' : 'Share'}
              </Button>
            )}
            {onClickMessageScheduler && onClickMessageSchedulerRefresh && (
              <div>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    onClickMessageScheduler();
                  }}
                  leftIcon={<Icon as={FiPlus} />}
                >
                  Schedule New Message
                </Button>
                <Button
                  style={{ marginLeft: 20 }}
                  onClick={() => {
                    onClickMessageSchedulerRefresh();
                  }}
                >
                  <Icon as={FiRefreshCw} />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            padding: '24px 48px',
            position: 'relative',
          }}
        >
          {isLocked && (
            <div
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <UnlockPremiumButton context={title[0]} />
            </div>
          )}
          <div
            style={{
              ...(isLocked && {
                filter: 'blur(8px)',
                opacity: 0.9,
              }),
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
