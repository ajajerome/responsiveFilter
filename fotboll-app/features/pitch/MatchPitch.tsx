import Svg, { Rect, Line, Circle } from 'react-native-svg';
import type { Level } from '@/types/content';
import { getZones } from '@/features/pitch/zones';

type Props = { width: number; height: number; level?: Level };

export default function MatchPitch({ width, height, level = '7-manna' }: Props) {
  const line = '#e6f5e9';
  const bounds = { x: 4, y: 4, w: width - 8, h: height - 8 };
  const z = getZones(level === '9-manna' ? '9-manna' : level === '7-manna' ? '7-manna' : '5-manna');
  // Penalty boxes and goal areas: centered horizontally, near top/bottom
  const penW = bounds.w * (level === '9-manna' ? 0.4 : 0.36);
  const penH = bounds.h * (level === '9-manna' ? 0.22 : 0.20);
  const smallW = bounds.w * (level === '9-manna' ? 0.2 : 0.18);
  const smallH = bounds.h * (level === '9-manna' ? 0.12 : 0.10);
  const penX = bounds.x + (bounds.w - penW) / 2;
  const smallX = bounds.x + (bounds.w - smallW) / 2;
  const topPenY = bounds.y;
  const botPenY = bounds.y + bounds.h - penH;
  const topSmallY = bounds.y;
  const botSmallY = bounds.y + bounds.h - smallH;
  const halfY = bounds.y + bounds.h / 2;
  const centerR = bounds.h * 0.12;
  // Retreat lines (7-manna): draw at thirds
  const attThirdY = bounds.y + z.attThirdY * bounds.h; // relative in zones is 0..1, scale to bounds
  const defThirdY = bounds.y + z.defThirdY * bounds.h;

  return (
    <Svg width={width} height={height}>
      <Rect x={0} y={0} width={width} height={height} fill="#0a7d2a" rx={12} />
      {/* Outer lines */}
      <Rect x={bounds.x} y={bounds.y} width={bounds.w} height={bounds.h} stroke={line} strokeWidth={2} fill="transparent" />
      {/* Halfway line & center circle */}
      <Line x1={bounds.x} y1={halfY} x2={bounds.x + bounds.w} y2={halfY} stroke={line} strokeWidth={2} />
      <Circle cx={bounds.x + bounds.w / 2} cy={halfY} r={centerR} stroke={line} strokeWidth={2} fill="transparent" />
      {/* Penalty areas (top and bottom) */}
      <Rect x={penX} y={topPenY} width={penW} height={penH} stroke={line} strokeWidth={2} fill="transparent" />
      <Rect x={penX} y={botPenY} width={penW} height={penH} stroke={line} strokeWidth={2} fill="transparent" />
      {/* Goal areas (small boxes) */}
      <Rect x={smallX} y={topSmallY} width={smallW} height={smallH} stroke={line} strokeWidth={2} fill="transparent" />
      <Rect x={smallX} y={botSmallY} width={smallW} height={smallH} stroke={line} strokeWidth={2} fill="transparent" />
      {/* Retreat lines for 7-manna */}
      {level === '7-manna' && (
        <>
          <Line x1={bounds.x} y1={attThirdY} x2={bounds.x + bounds.w} y2={attThirdY} stroke={line} strokeWidth={1.5} strokeDasharray="8 6" />
          <Line x1={bounds.x} y1={defThirdY} x2={bounds.x + bounds.w} y2={defThirdY} stroke={line} strokeWidth={1.5} strokeDasharray="8 6" />
        </>
      )}
    </Svg>
  );
}

