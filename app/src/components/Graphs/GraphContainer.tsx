import { Box, Icon, Text, theme as defaultTheme } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';

export function GraphContainer({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon: IconType;
  children: React.ReactNode;
}) {
  return (
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
          <div>
            <Text fontSize="lg" fontWeight={600}>
              {title}
            </Text>
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
  );
}
