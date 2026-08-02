import { ArrowRight } from "lucide-react";
import type { CtaSection as CtaSectionData } from "../../data/content";
import { AnimatedButton } from "./AnimatedButton";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

interface CtaSectionProps {
  cta: CtaSectionData;
  primaryTo?: string;
  secondaryTo?: string;
}

export function CtaSection({
  cta,
  primaryTo = "/contacto",
  secondaryTo = "/metodologia",
}: CtaSectionProps) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(99,102,241,0.18),transparent)]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                {cta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {cta.description}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <AnimatedButton to={primaryTo} icon={ArrowRight}>
                  {cta.primary}
                </AnimatedButton>
                <AnimatedButton to={secondaryTo} variant="secondary">
                  {cta.secondary}
                </AnimatedButton>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
