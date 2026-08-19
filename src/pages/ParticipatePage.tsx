import { Reveal } from "../components/ui/Reveal";
import { Container } from "../components/ui/Container";
import { CtaSection } from "../components/ui/CtaSection";
import { PageHeader } from "../components/ui/PageHeader";
import { cn } from "../utils/cn";
import { content } from "../data/content";

export function ParticipatePage() {
  const participate = content.participate;

  return (
    <>
      <PageHeader
        eyebrow={participate.eyebrow}
        title={participate.title}
        description={participate.description}
      />

      <section aria-label="Participar" className="pb-20 sm:pb-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <p className="text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
                {participate.intro}
              </p>
            </Reveal>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <Reveal>
              <h2 className="text-center text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
                {participate.rolesTitle}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {participate.roles.map((role, index) => (
                <Reveal
                  key={role.title}
                  delay={index * 0.08}
                  className="h-full"
                >
                  <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface/70 p-6 transition-colors duration-300 hover:border-zinc-600">
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-105",
                        role.accent,
                      )}
                    >
                      <role.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold tracking-tight text-zinc-100">
                      {role.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {role.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-24 max-w-4xl">
            <Reveal>
              <h2 className="text-center text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
                {participate.howTitle}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-center text-base leading-relaxed text-muted">
                {participate.howDescription}
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {participate.steps.map((step, index) => (
                <Reveal key={step.step} delay={index * 0.1} className="h-full">
                  <article className="relative h-full rounded-2xl border border-line bg-surface/70 p-6 text-left transition-colors duration-300 hover:border-zinc-600">
                    <span className="font-mono text-xs font-semibold tracking-widest text-accent-400">
                      {step.step}
                    </span>
                    <h3 className="mt-3 text-base font-semibold tracking-tight text-zinc-100">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CtaSection
        cta={{
          title: participate.ctaTitle,
          description: participate.ctaDescription,
          primary: participate.cta,
          secondary: participate.secondaryCta,
        }}
        primaryTo="/sumate"
        secondaryTo="/nosotros"
      />
    </>
  );
}
