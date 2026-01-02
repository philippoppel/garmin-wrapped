"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SlideWrapperProps {
  children: ReactNode;
  gradient?: string;
  className?: string;
}

export default function SlideWrapper({
  children,
  gradient = "from-garmin-dark via-[#1a1a2e] to-garmin-dark",
  className = "",
}: SlideWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`slide-container bg-gradient-to-br ${gradient} ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Animated number component
export function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  className = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      className={className}
    >
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("de-DE")}
      {suffix}
    </motion.span>
  );
}

// Animated text line
export function AnimatedLine({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
