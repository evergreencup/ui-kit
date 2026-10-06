/**
 * @file src/components/basics/Notice.tsx
 * @desc A striped note panel with a mono eyebrow over muted copy: "Pending · ref team",
 *       "In the workshop", anything not final yet. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { Eyebrow } from "./Eyebrow.js";
import type { LabelTone } from "./labelStyles.js";
import { panelClasses } from "./panelStyles.js";

/** Native aside props, plus the eyebrow and its tone. */
export type NoticeProps = Omit<ComponentProps<"aside">, "title"> & {
  /** The mono label on top (default "Pending"). */
  title?: ReactNode | undefined;
  tone?: LabelTone | undefined;
};

/**
 * @function Notice
 * @param props {NoticeProps} title, tone (default "cascade"), body and native aside props
 * @returns {JSX.Element} the striped note
 */
export const Notice = ({
  title = "Pending",
  tone = "cascade",
  className,
  children,
  ...props
}: NoticeProps) => (
  <aside
    className={panelClasses({
      tone: "striped",
      padding: "md",
      className: cx("flex flex-col gap-2", className),
    })}
    {...props}
  >
    <Eyebrow as="p" tone={tone}>
      {title}
    </Eyebrow>
    <div className="max-w-[65ch] text-fog-300 text-sm leading-relaxed">{children}</div>
  </aside>
);
