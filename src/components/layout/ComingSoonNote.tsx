/**
 * @file src/components/layout/ComingSoonNote.tsx
 * @desc The placeholder for a page still being built: a striped Notice ("In the workshop") in a
 *       page-width container. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { Container } from "../basics/Container.js";
import { Notice } from "../basics/Notice.js";

/** The note's label and body. */
export type ComingSoonNoteProps = { title?: ReactNode; children?: ReactNode };

/**
 * @function ComingSoonNote
 * @param props {ComingSoonNoteProps} title (default "In the workshop") and body
 * @returns {JSX.Element} the note section
 */
export const ComingSoonNote = ({
  title = "In the workshop",
  children = "This page is still being built. Content lands as the bracket and staff finalize.",
}: ComingSoonNoteProps) => (
  <Container as="section" className="py-12">
    <Notice title={title} tone="evergreen">
      {children}
    </Notice>
  </Container>
);
