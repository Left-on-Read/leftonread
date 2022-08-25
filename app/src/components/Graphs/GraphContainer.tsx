import { Box, Icon, Text, theme as defaultTheme } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { FiShare } from 'react-icons/fi';

import { ShareModal } from '../Sharing/ShareModal';

export function GraphContainer({
  title,
  description,
  icon,
  children,
  graphRefToShare,
}: {
  title: string;
  description?: string;
  icon: IconType;
  children: React.ReactNode;
  graphRefToShare?: React.MutableRefObject<null>;
}) {
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  return (
    <>
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        graphRefToShare={graphRefToShare}
      >
        {children}
      </ShareModal>
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
              {graphRefToShare && (
                <Icon
                  as={FiShare}
                  color="gray.500"
                  style={{ width: '18px', height: '18px', marginLeft: '10px' }}
                  onClick={() => setIsShareOpen(true)}
                />
              )}
            </div>
            <div>
              <Text fontSize="sm" color="gray">
                {description}
              </Text>
            </div>
          </div>
        </div>
        <div style={{ padding: '24px 48px' }}>{children}</div>
      </div>
    </>
  );
}
