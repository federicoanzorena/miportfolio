import { ArrowRight } from "lucide-react";
import { content } from "../../data/content";
import { cn } from "../../utils/cn";
import { AnimatedButton } from "../ui/AnimatedButton";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

export function DeliverablesPreview() {
  const { deliverablesPreview } = content.home;
  const featured = content.deliverables.items.slice(0, 4);

  return (
    <section
      aria-labelledby="deliverables-preview-title"
      className="py-20 sm:py-28"
    >
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionTitle
            id="deliverables-preview-title"
            align="left"
            eyebrow={deliverablesPreview.eyebrow}
            title={deliverablesPreview.title}
            description={deliverablesPreview.description}
          />
          <Reveal delay={0.15} className="shrink-0">
            <AnimatedButton
              to="/que-entrego"
              variant="secondary"
              icon={ArrowRight}
            >
              {deliverablesPreview.cta}
            </AnimatedButton>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08} className="h-full">
              <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface/70 p-6 transition-colors duration-300 hover:border-zinc-600">
                <span
                  aria-hidden
                  className={cn(
                    "grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-105",
                    item.accent,
                  )}
                >
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
