"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { modalKeyDown, useModal } from "@/hooks/useModal";
import { ease } from "@/lib/motion";

interface SheetProps {
  label: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Full-screen ivory overlay (design system §6.2 Sheet): rises from the bottom
 * on phones, fades in on desktop. Square corners, focus kept inside.
 */
export function Sheet({ label, title, onClose, children }: SheetProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useModal(ref);

  return createPortal(
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
      tabIndex={-1}
      onKeyDown={(e) => modalKeyDown(e, ref.current, onClose)}
      // Leaves along the path it came in by, a little quicker than it arrived.
      initial={{ opacity: 0, y: reduce ? 0 : 40 }}
      animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.5, ease: ease.editorial } }}
      exit={{
        opacity: 0,
        y: reduce ? 0 : 40,
        transition: { duration: reduce ? 0.15 : 0.3, ease: ease.editorial },
      }}
      className="fixed inset-0 z-[80] overflow-y-auto bg-surface outline-none"
    >
      <div className="page-x mx-auto flex min-h-full max-w-[64rem] flex-col py-6 desk:py-12">
        <div className="flex items-center justify-between gap-6">
          <p className="label text-gold-text">{label}</p>
          <button
            type="button"
            onClick={onClose}
            className="press label min-h-11 px-2 text-muted hover:text-ink"
          >
            關閉 · CLOSE
          </button>
        </div>
        <h2 id="sheet-title" className="mt-8 font-serif-zh text-h1-zh text-ink desk:mt-12">
          {title}
        </h2>
        <span aria-hidden className="mt-8 block h-px w-full bg-line" />
        <div className="flex-1 pb-16 pt-10">{children}</div>
      </div>
    </motion.div>,
    document.body,
  );
}
