import { Box, Divider, Skeleton, Stack, Text } from '@chakra-ui/react';
import { toPng } from 'html-to-image';
import { useEffect, useRef, useState } from 'react';

import Logo from '../../../../../assets/WrappedLogoWithText.svg';
import { ShareIndicator } from '../ShareIndicator';
import { Watermark } from '../Watermark';

export type WrappedOverviewData = {
  sentCount: number;
  receivedCount: number;
  words: string[];
  emojis: string[];
  topFriend: string;
};

function OverviewImageComponent({
  overviewData,
  contentRef,
}: {
  overviewData: WrappedOverviewData;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const { sentCount, receivedCount, words, emojis, topFriend } = overviewData;

  const labelColor = 'rgb(210,176,155)'; // #d2b09b
  const dataColor = 'rgb(213,242,139)'; // #d5f28b
  const backgroundColor = '#4C3757';
  return (
    <Box
      style={{
        position: 'absolute',
        left: 1000000,
        top: 10000000,
        width: '47.8125vh',
        height: '85vh',
      }}
    >
      <Box
        height="100%"
        width="100%"
        style={{
          borderRadius: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
        shadow="dark-lg"
      >
        <Box
          ref={contentRef}
          height="100%"
          width="100%"
          style={{ padding: '5vh', display: 'flex', flexDirection: 'column' }}
          bgColor="rgb(76,55,87)"
        >
          <Box
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={Logo}
              alt="Left on Read"
              style={{ height: '10vh', marginBottom: '10vh' }}
            />
            {/* <Box
              bgColor="purple.50"
              style={{
                position: 'absolute',
                zIndex: 2,
                height: '10vh',
                width: '10vh',
              }}
            /> */}

            <Stack
              style={{
                marginTop: '10vh',
                position: 'absolute',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                style={{
                  height: 10,
                  width: '70%',
                  marginRight: '4vh',
                  borderRadius: 16,
                }}
                bgColor={dataColor}
                shadow="lg"
              />
              <Box
                style={{
                  height: 10,
                  width: '70%',
                  marginLeft: '6vh',
                  borderRadius: 16,
                }}
                bgColor={dataColor}
                shadow="lg"
              />
              <Box
                style={{
                  height: 10,
                  width: '70%',
                  marginRight: '0.5vh',
                  borderRadius: 16,
                }}
                bgColor={dataColor}
                shadow="lg"
              />
            </Stack>
          </Box>
          <Box
            style={{
              marginTop: '2vh',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Text fontWeight="bold" fontSize="xl" color={labelColor}>
                Sent
              </Text>
              <Text
                fontSize="3xl"
                fontWeight="extrabold"
                //   bgGradient="linear(to-r, blue.400, red.400)"
                //   bgClip="text"
                color={dataColor}
              >
                {sentCount.toLocaleString()}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold" fontSize="xl" color={labelColor}>
                Received
              </Text>
              <Text
                fontSize="3xl"
                fontWeight="extrabold"
                //   bgGradient="linear(to-r, red.400, green.400)"
                //   bgClip="text"
                color={dataColor}
              >
                {receivedCount.toLocaleString()}
              </Text>
            </Box>
          </Box>
          <Box
            style={{
              marginTop: '4vh',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Text
                fontWeight="bold"
                fontSize="xl"
                style={{ marginBottom: '1vh' }}
                color={labelColor}
              >
                Top Words
              </Text>
              {words.map((word, index) => (
                <Box
                  key={word}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Text
                    style={{ width: '2.5vh' }}
                    fontWeight="semibold"
                    fontSize="lg"
                    color={labelColor}
                  >
                    {index + 1}
                  </Text>
                  <Text fontSize="xl" fontWeight="extrabold" color={dataColor}>
                    {word}
                  </Text>
                </Box>
              ))}
            </Box>
            <Box>
              <Text
                fontWeight="bold"
                fontSize="xl"
                style={{ marginBottom: '1vh' }}
                color={labelColor}
              >
                Top Emojis
              </Text>
              {emojis.map((word, index) => (
                <Box
                  key={word}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Text
                    style={{ width: '2.5vh' }}
                    fontWeight="bold"
                    fontSize="lg"
                    color={labelColor}
                  >
                    {index + 1}
                  </Text>
                  <Text fontSize="2xl" fontWeight="extrabold" color={dataColor}>
                    {word}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            style={{
              marginTop: '4vh',
            }}
          >
            <Text fontWeight="bold" fontSize="xl" color={labelColor}>
              Top Friend
            </Text>
            <Text fontWeight="extrabold" color={dataColor} fontSize="xl">
              {topFriend}
            </Text>
          </Box>
          <Box
            style={{
              marginTop: '2vh',
            }}
          >
            {/* <div className="mine messages">
              <div className="message last">
                <Text fontWeight="bold" color={backgroundColor}>
                  How?
                </Text>
              </div>
            </div> */}
            <div className="yours messages">
              <div className="message last">
                <Text fontWeight="bold" color={backgroundColor}>
                  {`leftonread.me/wrapped`.toLocaleUpperCase()}
                </Text>
              </div>
            </div>
            {/* <Text fontWeight="bold" color={dataColor} fontSize="sm">
              {`leftonread.me/wrapped`.toLocaleUpperCase()}
            </Text> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export function Overview({
  overviewData,
}: {
  overviewData: WrappedOverviewData;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState<string>('');

  const currentRef = ref.current;

  useEffect(() => {
    const generateImage = async () => {
      if (!currentRef) {
        return;
      }

      const dataurl = await toPng(currentRef);
      setImgSrc(dataurl);
    };

    generateImage();
  }, [currentRef]);

  return (
    <Box
      height="100%"
      width="100%"
      style={{
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
      shadow="dark-lg"
      bgColor="green.50"
    >
      <ShareIndicator
        contentRef={ref}
        onPause={() => {}}
        onStart={() => {}}
        loggingContext="Overview"
      />
      <OverviewImageComponent overviewData={overviewData} contentRef={ref} />
      <Box
        style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}
      >
        <Text
          fontWeight="extrabold"
          fontSize="3xl"
          bgGradient="linear(to-r, green.600, purple.600)"
          bgClip="text"
          mt="2"
        >
          Share Your Wrapped
        </Text>
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          shadow="dark-lg"
          style={{
            borderRadius: 16,
            display: 'flex',
            width: '70%',
            overflow: 'hidden',
          }}
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt="Graphic"
              style={{ width: '100%', borderRadius: 16 }}
            />
          ) : (
            <Skeleton width="100%" height="60vh" />
          )}
        </Box>
      </Box>
    </Box>
  );
}
