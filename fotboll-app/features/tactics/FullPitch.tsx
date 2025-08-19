import Svg, { Rect, Line } from 'react-native-svg';
import { View } from 'react-native';

type Props = { width: number; height: number };

export default function FullPitch({ width, height }: Props) {
  const line = '#e6f5e9';
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Rect x={0} y={0} width={width} height={height} fill="#0a7d2a" rx={12} />
        {/* Mittlinje */}
        <Line x1={width / 2} y1={0} x2={width / 2} y2={height} stroke={line} strokeWidth={2} />
      </Svg>
    </View>
  );
}

