export function generateSampledPoints(
  data: {
    y: number;
    x: string;
    is_from_me: number;
  }[],
  batchSize: number
) {
  const sampledData = [];
  let batchCounter = 0;
  let currentBatchTotal = 0;
  let startDate = data[0]?.x;

  data.forEach((point) => {
    currentBatchTotal += point.y;
    if (batchCounter === 0) {
      startDate = point.x;
    }
    batchCounter += 1;
    if (batchCounter === batchSize) {
      sampledData.push({
        y: currentBatchTotal,
        x: startDate,
        label: `${startDate} - ${point.x}`,
        is_from_me: point.is_from_me,
      });
      batchCounter = 0;
      currentBatchTotal = 0;
    }
  });

  if (batchCounter > 0) {
    sampledData.push({
      y: currentBatchTotal,
      x: startDate,
      label: `${startDate} - ${data[data.length - 1].x}`,
      is_from_me: data[data.length - 1].is_from_me,
    });
  }

  return sampledData;
}
