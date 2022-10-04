import { Box, Divider, Stack, Text } from '@chakra-ui/react';
import { toPng } from 'html-to-image';
import { useEffect, useRef, useState } from 'react';

import Logo from '../../../../../assets/icon.svg';
import { ShareIndicator } from '../ShareIndicator';
import { Watermark } from '../Watermark';

function OverviewImageComponent({
  contentRef,
}: {
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const sentCount = 38826;
  const receivedCount = 84723;
  const words = ['lol', 'haha', 'what'];
  const emojis = ['😖', '🤐', '🤖'];

  const labelColor = 'black.600';
  const dataColor = 'purple.700';

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
        bgColor="purple.100"
      >
        <Box
          ref={contentRef}
          height="100%"
          width="100%"
          style={{ padding: '5vh', display: 'flex', flexDirection: 'column' }}
          bgColor="purple.100"
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
              style={{ height: '15vh', zIndex: 3 }}
            />
            <Box
              bgColor="purple.50"
              style={{
                position: 'absolute',
                zIndex: 2,
                height: '10vh',
                width: '10vh',
              }}
            />

            <Stack
              style={{
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
                bgColor="blue.400"
                shadow="lg"
              />
              <Box
                style={{
                  height: 10,
                  width: '70%',
                  marginLeft: '6vh',
                  borderRadius: 16,
                }}
                bgColor="red.400"
                shadow="lg"
              />
              <Box
                style={{
                  height: 10,
                  width: '70%',
                  marginRight: '0.5vh',
                  borderRadius: 16,
                }}
                bgColor="green.400"
                shadow="lg"
              />
            </Stack>
          </Box>
          <Box
            style={{
              marginTop: '5vh',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Text fontWeight="semibold" fontSize="xl" color={labelColor}>
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
              <Text fontWeight="semibold" fontSize="xl" color={labelColor}>
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
                fontWeight="semibold"
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
                  <Text fontWeight="extrabold" color={dataColor}>
                    {word}
                  </Text>
                </Box>
              ))}
            </Box>
            <Box>
              <Text
                fontWeight="semibold"
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
                    fontWeight="semibold"
                    fontSize="lg"
                    color={labelColor}
                  >
                    {index + 1}
                  </Text>
                  <Text fontWeight="extrabold" color={dataColor}>
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
            <Text
              fontWeight="semibold"
              fontSize="xl"
              style={{ marginBottom: '1vh' }}
              color={labelColor}
            >
              Top Friend
            </Text>
            <Text fontWeight="extrabold" color={dataColor} fontSize="xl">
              Sally Xu
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export function Overview() {
  const ref = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState<string>('');

  const sentCount = 38826;
  const receivedCount = 84723;
  const words = ['lol', 'haha', 'what'];
  const emojis = ['😖', '🤐', '🤖'];

  const labelColor = 'black.600';
  const dataColor = 'purple.700';

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
      <ShareIndicator contentRef={ref} onPause={() => {}} onStart={() => {}} />
      <OverviewImageComponent contentRef={ref} />
      <Box
        style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}
      >
        <Text fontWeight="bold" fontSize="xl">
          Share #iMessageWrapped
        </Text>
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src={imgSrc}
          alt="Graphic"
          style={{ width: '70%', borderRadius: 16 }}
        />
      </Box>
    </Box>
  );
}
