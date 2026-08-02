import { motion } from "framer-motion";
import { content } from "../../data/content";
import { cn } from "../../utils/cn";

export function Timeline() {
  const { steps } = content.methodology;

  return (
    <div className="relative mx-auto max-w-4xl">
      <motion.div
        aria-hidden
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute left-[19px] top-0 h-full w-px origin-top bg-gradient-to-b from-accent-500/60 via-accent-500/25 to-transparent lg:left-[calc(50%-0.5px)]"
      />

      <ol className="space-y-8 lg:space-y-2">
        {steps.map((step, index) => {
          const isLeft = index % 2 === 0;
          const Icon = step.icon;

          return (
            <li
              key={step.number}
              className="relative pb-6 pl-16 lg:grid lg:grid-cols-2 lg:gap-20 lg:pb-4 lg:pl-0"
            >
              <div
                className={cn(
                  "lg:py-6",
                  isLeft
                    ? "lg:col-start-1 lg:text-right"
                    : "lg:col-start-2 lg:text-left",
                )}
              >
                <motion.article
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-line bg-surface/70 p-6 transition-colors duration-300 hover:border-zinc-600 sm:p-7",
                    isLeft && "lg:ml-auto",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute select-none font-semibold tracking-tight text-5xl text-zinc-800/60 sm:text-6xl",
                      isLeft
                        ? "left-5 top-3 sm:left-7"
                        : "right-5 top-3 sm:right-7",
                    )}
                  >
                    {step.number}
                  </span>

                  <div className="relative">
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-12 place-items-center rounded-xl border border-line bg-surface-2 text-accent-400 transition-transform duration-300 group-hover:scale-105",
                        isLeft && "lg:ml-auto",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted sm:text-[15px]">
                      {step.description}
                    </p>
                  </div>
                </motion.article>
              </div>

              <span
                aria-hidden
                className="absolute left-0 top-8 z-10 grid size-[38px] place-items-center rounded-full border border-accent-500/40 bg-base font-mono text-xs font-semibold text-accent-400 shadow-[0_0_20px_-4px_rgba(99,102,241,0.6)] lg:left-1/2 lg:-translate-x-1/2"
              >
                {step.number}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
