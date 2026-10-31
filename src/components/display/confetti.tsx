"use client";

import React, { useEffect, useState } from "react";
import useWindowSize from "~/components/hooks/use-window";
import Confetti from "react-confetti";

type ConfProps = {
  show: boolean;
};

// Kept low: hundreds of canvas pieces crash low-memory Android Chrome tabs
const PIECES = 150;

export function ConfettiComponent({ show }: ConfProps) {
  const { width, height } = useWindowSize();
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    );
  }, []);

  if (!show || reducedMotion || !width || !height) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={PIECES}
      />
    </div>
  );
}
