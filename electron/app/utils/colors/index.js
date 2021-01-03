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
  let { colorStart, colorEnd } = colorRangeInfo;
  let colorRange = colorEnd - colorStart;
  let intervalSize = colorRange / dataLength;
  let i, colorPoint;
  let colorArray = [];

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
  }) {
  let { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
  return (useEndAsStart
    ? (colorEnd - (i * intervalSize))
    : (colorStart + (i * intervalSize)));
}
