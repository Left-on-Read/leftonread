/* Must use an interpolated color scale, which has a range of [0, 1] */
export default function interpolateColors(
  dataLength,
  colorScale,
  colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
  }
) {
  const { colorStart, colorEnd } = colorRangeInfo;
  const colorRange = colorEnd - colorStart;
  const intervalSize = colorRange / dataLength;
  let i;
  let colorPoint;
  const colorArray = [];

  for (i = 0; i < dataLength; i++) {
    colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
    colorArray.push(colorScale(colorPoint));
  }

  return colorArray;
}

function calculatePoint(
  i,
  intervalSize,
  colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
  }
) {
  const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
  return useEndAsStart
    ? colorEnd - i * intervalSize
    : colorStart + i * intervalSize;
}
