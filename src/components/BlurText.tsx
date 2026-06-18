import { motion } from "motion/react";
import React from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({ text, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
      whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {text}
    </motion.div>
  );
};
