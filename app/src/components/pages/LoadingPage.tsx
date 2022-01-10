import { Spinner } from '@chakra-ui/react';
import React from 'react';

export function LoadingPage() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner thickness="4px" size="xl" color="purple.500" />
    </div>
  );
}
