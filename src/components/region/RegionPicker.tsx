/**
 * @file src/components/region/RegionPicker.tsx
 * @desc Client region picker: the map's five regions as a radio group (click, or arrows to move
 *       and pick, Enter or Space to pick), a live line naming the hovered or chosen region, and
 *       a chip row with the same choices plus an optional "Outside the PNW". Controlled.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { REGIONS } from "../../brand/identity.js";
import { cx } from "../../utils/cx.js";
import { rovingKey } from "../../utils/roving.js";
import { labelClasses } from "../basics/labelStyles.js";
import { panelClasses } from "../basics/panelStyles.js";
import { ChoiceChips, type ChoiceOption } from "../forms/ChoiceChips.js";
import { RegionMapFrame } from "./RegionMapFrame.js";
import { OUTSIDE_PNW, REGION_LOOK, type Region, type RegionChoice, regionPath } from "./regions.js";

/** The controlled choice and handler, plus the group's name and options. */
export type RegionPickerProps = {
  value: RegionChoice | null;
  onChange: (value: RegionChoice) => void;
  /** Offer "Outside the PNW" as a chip. */
  allowOutside?: boolean | undefined;
  /** The radio group's name (default "State or province of residence"). */
  label?: string | undefined;
  /** The live line when nothing is hovered or chosen (default "Pick your state or province"). */
  prompt?: string | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
};

/**
 * @function RegionPicker
 * @param props {RegionPickerProps} value, onChange, allowOutside, label, prompt, disabled and
 *        className
 * @returns {JSX.Element} the map, the live line and the chip row
 */
export const RegionPicker = ({
  value,
  onChange,
  allowOutside = false,
  label = "State or province of residence",
  prompt = "Pick your state or province",
  disabled = false,
  className,
}: RegionPickerProps) => {
  const [hovered, setHovered] = useState<Region | null>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const picked = REGIONS.indexOf(value as Region);
  const tabStop = Math.max(picked, 0);
  const pick = (r: RegionChoice) => {
    if (!disabled) onChange(r);
  };
  const onKeyDown = (index: number) => (event: KeyboardEvent<SVGPathElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(REGIONS[index] as Region);
      return;
    }
    const next = rovingKey(event.key, index, REGIONS.length);
    if (next === null) return;
    event.preventDefault();
    paths.current[next]?.focus();
    pick(REGIONS[next] as Region);
  };
  const hover = (r: Region | null) => () => {
    setHovered(r);
  };
  const options: ChoiceOption<RegionChoice>[] = [
    ...REGIONS.map((r) => ({ value: r, label: r })),
    ...(allowOutside ? [{ value: OUTSIDE_PNW, label: OUTSIDE_PNW, tone: "cascade" as const }] : []),
  ];
  return (
    <div className={cx("flex flex-col gap-4", className)}>
      <div
        className={panelClasses({ tone: "solid", padding: "sm", className: "flex flex-col gap-2" })}
        aria-disabled={disabled || undefined}
      >
        <RegionMapFrame title={label} interactive>
          <g role="radiogroup" aria-label={label} aria-disabled={disabled || undefined}>
            {REGIONS.map((r, i) => {
              const look = REGION_LOOK[r === value ? "on" : r === hovered ? "hover" : "idle"];
              return (
                // biome-ignore lint/a11y/useSemanticElements: an SVG shape can't be a native radio
                <path
                  key={r}
                  ref={(el) => {
                    paths.current[i] = el;
                  }}
                  d={regionPath(r)}
                  role="radio"
                  aria-checked={r === value}
                  aria-label={r}
                  tabIndex={!disabled && i === tabStop ? 0 : -1}
                  className={cx(
                    "outline-hidden transition-[fill,stroke] duration-150 focus-visible:stroke-fog-50 motion-reduce:transition-none focus-visible:[stroke-width:2.5]",
                    disabled ? "cursor-not-allowed" : "cursor-pointer",
                  )}
                  fill={look.fill}
                  stroke={look.stroke}
                  strokeWidth={look.width}
                  onClick={() => {
                    pick(r);
                  }}
                  onKeyDown={onKeyDown(i)}
                  onMouseEnter={hover(r)}
                  onMouseLeave={hover(null)}
                  onFocus={hover(r)}
                  onBlur={hover(null)}
                />
              );
            })}
          </g>
        </RegionMapFrame>
        <p
          aria-live="polite"
          className={labelClasses({ tone: "muted", className: "min-h-[1.2em]" })}
        >
          {hovered ?? value ?? prompt}
        </p>
      </div>
      <ChoiceChips
        label={`${label}, as a list`}
        options={options}
        value={value}
        onChange={pick}
        disabled={disabled}
      />
    </div>
  );
};
