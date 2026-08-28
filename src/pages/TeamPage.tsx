import { ArrowRight, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedButton } from "../components/ui/AnimatedButton";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Reveal } from "../components/ui/Reveal";
import { content } from "../data/content";

export function TeamPage() {
  const team = content.team;
  const openCount = team.members.filter((member) => !member.filled).length;

  return (
    <>
      <PageHeader
        eyebrow={team.eyebrow}
        title={team.title}
        description={team.description}
      />

      <section aria-label="Miembros del equipo" className="pb-20 sm:pb-28">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.members.map((member, index) => (
              <Reveal key={member.id} delay={index * 0.08} className="h-full">
                {member.filled && member.photo ? (
                  <article className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface/70">
                    <img
                      src={member.photo}
                      alt={member.photoAlt ?? member.name}
                      width={768}
                      height={960}
                      loading="lazy"
                      className="aspect-4/5 w-full object-cover object-[center_30%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-5 pt-16">
                      <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
                        {member.name}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-300">
                        {member.role}
                      </p>
                    </div>
                  </article>
                ) : (
                  <Link
                    to="/participar"
                    aria-label={`${member.role} — postularse`}
                    className="focus-ring group flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-700 bg-surface/30 p-8 text-center transition-colors duration-300 hover:border-accent-500/60 hover:bg-surface/60"
                  >
                    <span
                      aria-hidden
                      className="grid size-12 place-items-center rounded-full border border-line bg-surface text-accent-400 transition-transform duration-300 group-hover:scale-110"
                    >
                      <UserPlus className="size-5" />
                    </span>
                    <span>
                      <span className="block text-base font-semibold tracking-tight text-zinc-100">
                        {member.name}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {member.role}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-400">
                      Cupo abierto
                      <ArrowRight
                        aria-hidden
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                )}
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            {team.bio.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <p className="text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
                  {paragraph}
                </p>
                {index < team.bio.length - 1 ? <div className="h-5" /> : null}
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <h2 className="mt-10 text-sm font-semibold uppercase tracking-widest text-subtle">
                Áreas de trabajo
              </h2>
            </Reveal>
            <Reveal delay={0.25}>
              <ul className="mt-4 flex flex-wrap gap-2">
                {team.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-zinc-300"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10">
                <AnimatedButton to="/participar" icon={UserPlus}>
                  {team.openCta} · {openCount} cupos
                </AnimatedButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
