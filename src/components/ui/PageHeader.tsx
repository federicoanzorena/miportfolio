import { motion } from "framer-motion";
import { Container } from "./Container";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  const transition = {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(99,102,241,0.16),transparent)]"
      />
      <Container className="relative pb-14 pt-24 text-center sm:pb-20 sm:pt-32">
        <motion.span
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ ...transition, delay: 0.05 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent-400"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ ...transition, delay: 0.1 }}
          className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ ...transition, delay: 0.18 }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
        >
          {description}
        </motion.p>
      </Container>
    </header>
  );
}
