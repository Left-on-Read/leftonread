import {
  Box,
  Button,
  Icon,
  Text,
  theme as defaultTheme,
  Tooltip,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { FiPlus, FiRefreshCw, FiShare } from 'react-icons/fi';

import { logEvent } from '../../utils/analytics';
import { useGoldContext } from '../Premium/GoldContext';
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
  nextButton,
  backButton,
}: {
  title: string[];
  description?: string;
  icon: IconType;
  children: React.ReactNode;
  tooltip?: React.ReactNode;
  nextButton?: React.ReactNode;
  backButton?: React.ReactNode;
  isPremiumGraph?: boolean;
  onClickMessageScheduler?: () => void;
  onClickMessageSchedulerRefresh?: () => void;
  setIsShareOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  showGroupChatShareButton?: boolean;
}) {
  const { isPremium } = useGoldContext();
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const isLocked = isPremiumGraph && !isPremium;

  useEffect(() => {
    async function fetchTooltip() {
      const showTooltip: boolean = await ipcRenderer.invoke(
        'store-get-show-share-tooltip'
      );
      setIsTooltipOpen(showTooltip);
    }

    const timer = setTimeout(() => {
      fetchTooltip();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
              // <Tooltip
              //   hasArrow
              //   label="Share with your friends!"
              //   placement="bottom"
              //   isOpen={isTooltipOpen}
              // >
              <Button
                style={{
                  padding: showGroupChatShareButton ? '0px 30px' : undefined,
                }}
                onClick={async () => {
                  setIsTooltipOpen(false);
                  ipcRenderer.invoke('store-set-show-share-tooltip', false);
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
              // </Tooltip>
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

            {nextButton && backButton && (
              <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '20px' }}>{backButton}</div>
                {nextButton}
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
