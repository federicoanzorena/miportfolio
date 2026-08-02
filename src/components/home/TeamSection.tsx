import { ArrowRight, UserPlus } from "lucide-react";
import { content } from "../../data/content";
import { AnimatedButton } from "../ui/AnimatedButton";
import { Container } from "../ui/Container";
import { PortraitFrame } from "../ui/PortraitFrame";
import { Reveal } from "../ui/Reveal";

export function TeamSection() {
  const team = content.team;
  const openCount = team.members.filter((member) => !member.filled).length;

  return (
    <section aria-labelledby="team-title" className="py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <PortraitFrame showPill />
          </Reveal>

          <div>
            <Reveal>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent-400">
                {team.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="team-title"
                className="text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
              >
                {team.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-2 bg-gradient-to-r from-accent-300 to-violet-400 bg-clip-text text-lg font-medium text-transparent">
                {team.intro}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {team.description}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="mt-7 flex flex-wrap gap-2">
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
            <Reveal delay={0.25}>
              <div className="mt-9 flex flex-wrap gap-3">
                <AnimatedButton to="/participar" icon={UserPlus}>
                  {openCount} cupos abiertos
                </AnimatedButton>
                <AnimatedButton
                  to="/nosotros"
                  variant="secondary"
                  icon={ArrowRight}
                >
                  {team.homeCta}
                </AnimatedButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
