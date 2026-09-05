import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-line bg-surface/70 backdrop-blur-sm",
        className,
      )}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}
