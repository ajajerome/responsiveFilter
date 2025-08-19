import { useRef, useState } from 'react';
import Svg, { Line, Polygon } from 'react-native-svg';
import { PanResponder, View } from 'react-native';

type Arrow = { from: { x: number; y: number }; to: { x: number; y: number }; kind: 'attack' | 'defense' };

type Props = {
  width: number;
  height: number;
  onArrowsChanged?: (arrows: Arrow[]) => void;
};

export default function ArrowsLayer({ width, height, onArrowsChanged }: Props) {
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setStart({ x: locationX, y: locationY });
      },
      onPanResponderRelease: (e) => {
        if (!start) return;
        const { locationX, locationY } = e.nativeEvent;
        const next: Arrow[] = [...arrows, { from: start, to: { x: locationX, y: locationY }, kind: 'attack' }];
        setArrows(next);
        onArrowsChanged?.(next);
        setStart(null);
      },
    })
  ).current;

  return (
    <View {...pan.panHandlers} style={{ position: 'absolute', left: 0, top: 0, width, height }}>
      <Svg width={width} height={height}>
        {arrows.map((a, i) => {
          const color = a.kind === 'attack' ? '#1e90ff' : '#ff3b30';
          const dx = a.to.x - a.from.x;
          const dy = a.to.y - a.from.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const head = 10;
          const leftX = a.to.x - ux * head - uy * head * 0.6;
          const leftY = a.to.y - uy * head + ux * head * 0.6;
          const rightX = a.to.x - ux * head + uy * head * 0.6;
          const rightY = a.to.y - uy * head - ux * head * 0.6;
          return (
            <>
              <Line key={`l-${i}`} x1={a.from.x} y1={a.from.y} x2={a.to.x} y2={a.to.y} stroke={color} strokeWidth={3} />
              <Polygon key={`p-${i}`} points={`${a.to.x},${a.to.y} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} />
            </>
          );
        })}
      </Svg>
    </View>
  );
}

