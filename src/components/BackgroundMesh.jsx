import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function BackgroundMesh() {
  const shouldReduceMotion = useReducedMotion();

  const orbVariants = {
    animate1: {
      x: shouldReduceMotion ? 0 : [0, 40, -30, 0],
      y: shouldReduceMotion ? 0 : [0, -35, 25, 0],
      scale: shouldReduceMotion ? 1 : [1, 1.08, 0.95, 1],
      transition: {
        duration: 18,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    animate2: {
      x: shouldReduceMotion ? 0 : [0, -50, 20, 0],
      y: shouldReduceMotion ? 0 : [0, 30, -40, 0],
      scale: shouldReduceMotion ? 1 : [1, 0.94, 1.06, 1],
      transition: {
        duration: 22,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    animate3: {
      x: shouldReduceMotion ? 0 : [0, 30, -40, 0],
      y: shouldReduceMotion ? 0 : [0, -25, 35, 0],
      scale: shouldReduceMotion ? 1 : [1, 1.05, 0.97, 1],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="ambient-bg" aria-hidden="true">
      {/* Background radial gradient mesh orbs */}
      <motion.div
        variants={orbVariants}
        animate="animate1"
        className="orb-1"
      />
      <motion.div
        variants={orbVariants}
        animate="animate2"
        className="orb-2"
      />
      <motion.div
        variants={orbVariants}
        animate="animate3"
        className="orb-3"
      />

      {/* Subtle fine dot matrix overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.08)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
    </div>
  );
}

export default BackgroundMesh;
