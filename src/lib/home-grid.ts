/**
 * iOS 26 home screen grid, measured on a 440 × 956 pt iPhone (home2.html) and scaled
 * proportionally for other sizes. Keep in sync with HomeGrid in targets/widget/WallpaperGlass.swift.
 */
export function homeGrid(width: number, height: number) {
  const s = width / 440;
  return {
    margin: 24 * s,
    pitch: 103.4 * s,
    top: (86 * height) / 956,
    icon: 81 * s,
    small: 184.4 * s,
    medium: 391.2 * s,
    widgetRadius: 34 * s,
    iconRadius: 19 * s,
  };
}

export type HomeGrid = ReturnType<typeof homeGrid>;

/** Top-left of the icon cell at column 0–3, row 0–5. Widgets start on a cell too. */
export function cellOrigin(grid: HomeGrid, col: number, row: number) {
  return { left: grid.margin + col * grid.pitch, top: grid.top + row * grid.pitch };
}
