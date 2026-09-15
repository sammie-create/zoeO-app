"use client";

import { Lottie } from "lottie-react";
import spinnerData from "@/lib/spinner.json";

export function Spinner({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <Lottie
      src={spinnerData}
      loop
      autoplay
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
