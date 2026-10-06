/**
 * @file src/components/basics/CopyButton.tsx
 * @desc Client button that copies a value to the clipboard and says "Copied" for two
 *       seconds ("Failed" if the clipboard refuses), announced through a polite live region.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "./Button.js";

/** Button props minus onClick, plus the value to copy and the three labels. */
export type CopyButtonProps = Omit<ButtonProps, "onClick" | "children"> & {
  value: string;
  label?: string | undefined;
  copiedLabel?: string | undefined;
  failedLabel?: string | undefined;
};

type CopyState = "idle" | "copied" | "failed";

/**
 * @function CopyButton
 * @param props {CopyButtonProps} value, labels (default "Copy" / "Copied" / "Failed") and button
 *        props (variant defaults to "outline", size to "sm")
 * @returns {JSX.Element} the button, its visible label swapping with the copy result
 */
export const CopyButton = ({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  failedLabel = "Failed",
  variant = "outline",
  size = "sm",
  ...props
}: CopyButtonProps) => {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => {
      setState("idle");
    }, 2000);
    return () => {
      window.clearTimeout(timer);
    };
  }, [state]);

  const copy = (): void => {
    navigator.clipboard.writeText(value).then(
      () => {
        setState("copied");
      },
      () => {
        setState("failed");
      },
    );
  };

  return (
    <Button variant={variant} size={size} onClick={copy} {...props}>
      <span aria-live="polite">
        {state === "copied" ? copiedLabel : state === "failed" ? failedLabel : label}
      </span>
    </Button>
  );
};
