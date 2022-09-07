import {
  Box,
  Button,
  Icon,
  Text,
  theme as defaultTheme,
} from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';
import { FiShare } from 'react-icons/fi';

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
  setIsShareOpen,
}: {
  title: string[];
  description?: string;
  icon: IconType;
  children: React.ReactNode;
  tooltip?: React.ReactNode;
  isPremiumGraph?: boolean;
  setIsShareOpen?: React.Dispatch<React.SetStateAction<boolean>>;
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
              paddingRight: 36,
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text fontSize="sm" color="gray">
                  {description}
                </Text>
                <span style={{ marginLeft: '10px' }}>{tooltip}</span>
              </div>
            </div>
            {!isLocked && setIsShareOpen && (
              // <IconButton
              //   icon={<Icon as={FiShare} />}
              //   aria-label="Share"
              //   onClick={() => {
              //     setIsShareOpen(true);
              //     logEvent({
              //       eventName: 'SHARE_GRAPH',
              //       properties: {
              //         graph: title[0],
              //       },
              //     });
              //   }}
              // />
              <Button
                onClick={() => {
                  setIsShareOpen(true);
                  logEvent({
                    eventName: 'SHARE_GRAPH',
                    properties: {
                      graph: title[0],
                    },
                  });
                }}
                rightIcon={<Icon as={FiShare} />}
              >
                Share
              </Button>
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
              <UnlockPremiumButton />
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
