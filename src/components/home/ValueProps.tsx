import { content } from "../../data/content";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";

export function ValueProps() {
  const { highlight } = content.home;

  return (
    <section
      aria-label="Qué ofrece este servicio"
      className="border-y border-line bg-surface/30 py-20 sm:py-24"
    >
      <Container>
        <h2 className="sr-only">Beneficios del servicio</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {highlight.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.1} className="h-full">
              <Card className="flex h-full flex-col gap-4 p-6">
                <span
                  aria-hidden
                  className="grid size-11 place-items-center rounded-xl border border-line bg-surface-2 text-accent-400"
                >
                  <item.icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
