import {
  IWordOrEmojiFilters,
  queryEmojiOrWordCounts,
} from 'analysis/queries/WordOrEmojiQuery';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import * as sqlite3 from 'sqlite3';
import * as unicodeEmoji from 'unicode-emoji';

import { interpolateColors } from 'utils/interpolateColors';
import { Bar } from 'react-chartjs-2';

const allEmojis = unicodeEmoji.getEmojis();
function addDescriptionToNewerEmojis(emoji: string) {
  const emojiData = allEmojis.find((e) => emoji === e.emoji);
  // TODO: We should have a mapping between emoji versions and Mac OS versions.
  // For example, I assume on the latest version of Mac OS, emojis in v13 are present.
  if (emojiData && parseFloat(emojiData.version) > 12.1) {
    return emojiData.description;
  }
  return emoji;
}

interface WordOrEmojiCountProps {
  db: sqlite3.Database;
  titleText: string;
  labelText: string;
  filters: IWordOrEmojiFilters;
  colorInterpolationFunc: (t: number) => string;
}

export default function WordOrEmojiCountChart(props: WordOrEmojiCountProps) {
  const { db, colorInterpolationFunc, titleText, labelText, filters } = props;
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function fetchWordData() {
      try {
        const data = await queryEmojiOrWordCounts(db, filters);
        setSuccess(true);
        setWords(data.map((obj) => obj.word));
        setCount(data.map((obj) => obj.count));
      } catch (err) {
        setSuccess(false);
        log.error(`ERROR: fetching for ${titleText}`, err);
      }
    }
    fetchWordData();
  }, [db, titleText, filters]);

  const COLORS = interpolateColors(words.length, colorInterpolationFunc);

  const data = {
    labels: filters.isEmoji
      ? words.map((emoji) => addDescriptionToNewerEmojis(emoji))
      : words,
    datasets: [
      {
        label: labelText,
        data: count,
        backgroundColor: COLORS,
      },
    ],
  };

  const options = {
    // title: {
    //   display: true,
    //   text: titleText,
    // },
    // scales: {
    //   yAxes: [
    //     {
    //       ticks: {
    //         beginAtZero: true,
    //       },
    //     },
    //   ],
    // },
  };

  let label = '';
  if (filters.isFromMe) {
    if (filters.isEmoji) {
      label = 'EMOJI_COUNT_SENT';
    } else {
      label = 'WORD_COUNT_SENT';
    }
  } else if (filters.isEmoji) {
    label = 'EMOJI_COUNT_RECEIVED';
  } else {
    label = 'WORD_COUNT_RECEIVED';
  }

  // return (
  //   <BarChartWrapper
  //     data={data}
  //     labels={words}
  //     options={options}
  //     titleText={titleText}
  //     success={success}
  //   />
  // );

  if (!success) {
    return <div> Loading Chart...</div>;
  }

  return <Bar data={data} options={options} />;
}
