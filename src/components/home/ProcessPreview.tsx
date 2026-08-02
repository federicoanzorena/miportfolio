import { ArrowRight, Check } from "lucide-react";
import { content } from "../../data/content";
import { AnimatedButton } from "../ui/AnimatedButton";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

const phaseIcons = [
  content.methodology.steps[0].icon,
  content.methodology.steps[3].icon,
  content.methodology.steps[7].icon,
];

export function ProcessPreview() {
  const { processPreview } = content.home;

  return (
    <section aria-labelledby="process-preview-title" className="py-20 sm:py-28">
      <Container>
        <SectionTitle
          id="process-preview-title"
          eyebrow={processPreview.eyebrow}
          title={processPreview.title}
          description={processPreview.description}
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {processPreview.steps.map((step, index) => {
            const Icon = phaseIcons[index];

            return (
              <Reveal key={step.label} delay={index * 0.1} className="h-full">
                <article className="group relative h-full rounded-2xl border border-line bg-surface/70 p-6 transition-colors duration-300 hover:border-zinc-600">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden
                      className="grid size-11 place-items-center rounded-xl border border-line bg-surface-2 text-accent-400 transition-transform duration-300 group-hover:scale-105"
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-semibold tracking-widest text-subtle">
                      {step.phase}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-100">
                    {step.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-subtle">
              {processPreview.tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-accent-500" aria-hidden />
                  {tag}
                  {i < 3 ? (
                    <ArrowRight
                      className="ml-2 size-3 text-zinc-700"
                      aria-hidden
                    />
                  ) : null}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <AnimatedButton
              to="/metodologia"
              variant="secondary"
              icon={ArrowRight}
            >
              {processPreview.cta}
            </AnimatedButton>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
