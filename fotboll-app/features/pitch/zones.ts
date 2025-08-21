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
  grid: GridSpec;
};

export type GridSpec = {
  rows: number;
  cols: number;
  // 1-based cell index (row-major): 1..rows*cols
  centerOf(index: number): { x: number; y: number };
  rectOf(index: number, spanRows?: number, spanCols?: number): { x: number; y: number; width: number; height: number };
  indexOf(row: number, col: number): number;
};

function makeGrid(rows: number, cols: number): GridSpec {
  return {
    rows,
    cols,
    centerOf(index: number) {
      const i = Math.max(1, Math.min(rows * cols, index));
      const r = Math.floor((i - 1) / cols) + 1;
      const c = ((i - 1) % cols) + 1;
      const cellW = 1 / cols;
      const cellH = 1 / rows;
      return { x: (c - 0.5) * cellW, y: (r - 0.5) * cellH };
    },
    rectOf(index: number, spanRows = 1, spanCols = 1) {
      const i = Math.max(1, Math.min(rows * cols, index));
      const r = Math.floor((i - 1) / cols) + 1;
      const c = ((i - 1) % cols) + 1;
      const cellW = 1 / cols;
      const cellH = 1 / rows;
      return { x: (c - 1) * cellW, y: (r - 1) * cellH, width: cellW * spanCols, height: cellH * spanRows };
    },
    indexOf(row: number, col: number) {
      const r = Math.max(1, Math.min(rows, row));
      const c = Math.max(1, Math.min(cols, col));
      return (r - 1) * cols + c;
    },
  };
}

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
    grid: makeGrid(level === '9-manna' ? 9 : 7, level === '9-manna' ? 6 : 5),
  };
}

