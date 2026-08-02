import { Check } from "lucide-react";
import { ArchitectureTree } from "../components/architecture/ArchitectureTree";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Reveal } from "../components/ui/Reveal";
import { SectionTitle } from "../components/ui/SectionTitle";
import { content } from "../data/content";

export function ArchitecturePage() {
  const architecture = content.architecture;

  return (
    <>
      <PageHeader
        eyebrow={architecture.eyebrow}
        title={architecture.title}
        description={architecture.description}
      />

      <section aria-label="Árbol de proyecto" className="pb-20 sm:pb-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="order-2 lg:order-1">
              <ArchitectureTree />
            </Reveal>
            <div className="order-1 lg:order-2">
              <Reveal>
                <h2 className="text-balance text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                  Una estructura pensada para quien la mantiene después
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted">
                  {architecture.treeIntro}
                </p>
              </Reveal>
              <ul className="mt-8 space-y-4">
                {architecture.checklist.map((item, index) => (
                  <Reveal key={item} delay={0.1 + index * 0.08} as="li">
                    <span className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-600/20 text-accent-400"
                      >
                        <Check className="size-3" />
                      </span>
                      <span className="text-sm leading-relaxed text-zinc-300">
                        {item}
                      </span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="architecture-reasons-title"
        className="border-t border-line bg-surface/30 py-20 sm:py-24"
      >
        <Container>
          <SectionTitle
            id="architecture-reasons-title"
            eyebrow="Beneficios"
            title="Por qué esta arquitectura funciona"
            description="La separación de responsabilidades no es una moda: es la base del mantenimiento real a largo plazo."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {architecture.reasons.map((reason, index) => (
              <Reveal
                key={reason.title}
                delay={index * 0.07}
                className="h-full"
              >
                <article className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface/70 p-6 transition-colors duration-300 hover:border-zinc-600">
                  <span
                    aria-hidden
                    className="grid size-11 place-items-center rounded-xl border border-line bg-surface-2 text-accent-400 transition-transform duration-300 group-hover:scale-105"
                  >
                    <reason.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
                      {reason.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {reason.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
