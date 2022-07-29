import { Text } from '@chakra-ui/react';
import React from 'react';

export function GraphContainer({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <Text fontSize="md" fontWeight={900}>
          {title}
        </Text>
      </div>
      <div>
        <Text fontSize="sm" color="gray">
          {description}
        </Text>
      </div>
      <div style={{ padding: '24px 48px' }}>{children}</div>
    </div>
  );
}
