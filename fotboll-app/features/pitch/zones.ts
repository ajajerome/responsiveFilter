export type PitchZones = {
  oppGoalY: number;
  ourGoalY: number;
  centerX: number;
  leftX: number;
  rightX: number;
  halfY: number;
  attThirdY: number;
  defThirdY: number;
  boxDef: { x: number; y: number; width: number; height: number };
  boxAtt: { x: number; y: number; width: number; height: number };
  corners: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
};

export function getZones(level: '7-manna' | '9-manna' | '5-manna' = '7-manna'): PitchZones {
  // Vertical orientation: opponent goal at top, our goal at bottom
  const centerX = 0.5;
  const leftX = 0.12;
  const rightX = 0.88;
  const oppGoalY = 0.06;
  const ourGoalY = 0.94;
  const halfY = 0.5;
  const attThirdY = 0.28; // attacking third towards opponent goal
  const defThirdY = 0.72; // defensive third towards our goal
  const boxWidth = level === '9-manna' ? 0.22 : 0.18;
  const boxHeight = level === '9-manna' ? 0.16 : 0.14;
  return {
    oppGoalY,
    ourGoalY,
    centerX,
    leftX,
    rightX,
    halfY,
    attThirdY,
    defThirdY,
    boxDef: { x: centerX - boxWidth / 2, y: defThirdY - boxHeight / 2, width: boxWidth, height: boxHeight },
    boxAtt: { x: centerX - boxWidth / 2, y: attThirdY - boxHeight / 2, width: boxWidth, height: boxHeight },
    corners: {
      topLeft: { x: leftX, y: oppGoalY },
      topRight: { x: rightX, y: oppGoalY },
      bottomLeft: { x: leftX, y: ourGoalY },
      bottomRight: { x: rightX, y: ourGoalY },
    },
  };
}

