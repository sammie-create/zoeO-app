"use client";

import { motion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

const variantOffsets: Record<string, { x?: number; y?: number; scale?: number }> = {
  up: { y: 22 },
  fade: {},
  left: { x: -24 },
  right: { x: 24 },
  zoom: { scale: 0.95 },
};

function buildVariants(kind: keyof typeof variantOffsets): Variants {
  const offset = variantOffsets[kind];
  return {
    hidden: { opacity: 0, ...offset },
    show: { opacity: 1, x: 0, y: 0, scale: 1 },
  };
}

type RevealProps = {
  as?: ElementType;
  variant?: "up" | "fade" | "left" | "right" | "zoom";
  delay?: number;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
};

export function Reveal({ as = "div", variant = "up", delay = 250, className, children, ...rest }: RevealProps) {
  const MotionTag = (typeof as === "string" ? motion[as as keyof typeof motion] : motion.create(as)) as typeof motion.div;

  return (
    <MotionTag
      variants={buildVariants(variant)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -40px 0px", amount: 0.14 }}
      transition={{ duration: 1.8, delay: delay / 1000, ease: [0.22, 0.7, 0.28, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function ImgReveal({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -40px 0px", amount: 0.14 }}
      variants={{ hidden: {}, show: {} }}
      className={`overflow-hidden ${className ?? ""}`.trim()}
    >
      <motion.div
        variants={{ hidden: { scale: 1.08 }, show: { scale: 1 } }}
        transition={{ duration: 1.4, ease: [0.22, 0.7, 0.28, 1] }}
        className="size-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
