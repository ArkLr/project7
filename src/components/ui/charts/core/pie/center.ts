import type { PieData, PieStableValue } from "../types/pie";

/** What PieCenter shows: nothing for a solid pie; else the hovered slice (none while scrubbing geometry), the inner radius and the total. */
export const pieCenterOf = <Ref>(stable: Readonly<PieStableValue<Ref>>, hoveredIndex: number | null): { hoveredData: PieData | undefined; innerRadius: number; totalValue: number } | null =>
  stable.innerRadius <= 0
    ? null
    : {
        hoveredData: stable.geometryScrubbing || hoveredIndex === null ? undefined : stable.data[hoveredIndex],
        innerRadius: stable.innerRadius,
        totalValue: stable.totalValue,
      };

/** The datum a render child gets at rest: the total under `defaultLabel`. */
export const pieCenterRest = (label: string, value: number): PieData => ({ label, value });

/** A stand-in pie context for PieCenterShell: no slices, a square of `size` px, and `value` as the total. */
export const pieCenterShellContext = (value: number, size: number, innerRadius: number): PieStableValue<{ current: HTMLDivElement | null }> => ({
  animationKey: 0,
  arcs: [],
  center: size / 2,
  containerRef: { current: null },
  cornerRadius: 0,
  data: [],
  enterStaggerScale: 1,
  geometryScrubbing: false,
  getColor: () => "currentColor",
  getFill: () => "currentColor",
  hoverOffset: 0,
  innerRadius,
  isLoaded: true,
  outerRadius: size / 2,
  padAngle: 0,
  scrubSlicePaths: null,
  size,
  totalValue: value,
});
