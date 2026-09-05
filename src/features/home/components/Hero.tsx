import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FolderTree, MessageSquare } from "lucide-react";
import { content } from "@shared/data/content";
import { AnimatedButton } from "@shared/ui/AnimatedButton";
import { HeroVisual } from "./HeroVisual";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const { hero } = content.home;
  const reduceMotion = useReducedMotion();

  const transition = {
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(65%_100%_at_50%_0%,rgba(99,102,241,0.14),transparent)]"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.span
            variants={item}
            transition={transition}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent-400"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-accent-500" />
            {hero.badge}
          </motion.span>

          <motion.h1
            variants={item}
            transition={transition}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl"
          >
            {hero.titleA}{" "}
            <span className="bg-gradient-to-r from-accent-300 via-accent-500 to-violet-500 bg-clip-text text-transparent">
              {hero.titleAccent}
            </span>{" "}
            {hero.titleB}
          </motion.h1>

          <motion.p
            variants={item}
            transition={transition}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
          >
            {hero.description}
          </motion.p>

          <motion.div
            variants={item}
            transition={transition}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <AnimatedButton to="/metodologia" icon={ArrowRight}>
              {hero.primaryCta}
            </AnimatedButton>
            <AnimatedButton
              to="/arquitectura"
              variant="secondary"
              icon={FolderTree}
            >
              {hero.secondaryCta}
            </AnimatedButton>
            <AnimatedButton
              to="/modificar"
              variant="secondary"
              icon={MessageSquare}
            >
              {content.home.cta.primary}
            </AnimatedButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <HeroVisual />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center text-xs font-medium uppercase tracking-widest text-subtle"
          >
            {hero.visualCaption}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
