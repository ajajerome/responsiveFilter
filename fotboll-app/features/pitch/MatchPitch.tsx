import Svg, { Rect, Line, Circle } from 'react-native-svg';

type Props = { width: number; height: number };

export default function MatchPitch({ width, height }: Props) {
  const line = '#e6f5e9';
  const boxW = width * 0.18;
  const boxH = height * 0.28;
  const smallBoxW = width * 0.1;
  const smallBoxH = height * 0.14;
  return (
    <Svg width={width} height={height}>
      <Rect x={0} y={0} width={width} height={height} fill="#0a7d2a" rx={12} />
      {/* Outer lines */}
      <Rect x={4} y={4} width={width - 8} height={height - 8} stroke={line} strokeWidth={2} fill="transparent" />
      {/* Mid line & circle */}
      <Line x1={width / 2} y1={4} x2={width / 2} y2={height - 4} stroke={line} strokeWidth={2} />
      <Circle cx={width / 2} cy={height / 2} r={height * 0.12} stroke={line} strokeWidth={2} fill="transparent" />
      {/* Penalty boxes */}
      <Rect x={4} y={(height - boxH) / 2} width={boxW} height={boxH} stroke={line} strokeWidth={2} fill="transparent" />
      <Rect x={width - 4 - boxW} y={(height - boxH) / 2} width={boxW} height={boxH} stroke={line} strokeWidth={2} fill="transparent" />
      {/* Small boxes */}
      <Rect x={4} y={(height - smallBoxH) / 2} width={smallBoxW} height={smallBoxH} stroke={line} strokeWidth={2} fill="transparent" />
      <Rect x={width - 4 - smallBoxW} y={(height - smallBoxH) / 2} width={smallBoxW} height={smallBoxH} stroke={line} strokeWidth={2} fill="transparent" />
    </Svg>
  );
}

