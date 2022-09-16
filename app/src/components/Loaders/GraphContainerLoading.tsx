import { Skeleton } from '@chakra-ui/react';

export function GraphContainerLoading() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
        }}
      >
        <Skeleton height={45} width={425} />
        <Skeleton width={105} />
      </div>
      <div style={{ marginTop: '45px' }}>
        <Skeleton height={200} />
      </div>
    </>
  );
}
