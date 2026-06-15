"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MEMBERS, type Member } from "@/lib/members";

function PlayerCard({ member }: { member: Member }) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      style={{ ["--tint" as string]: member.tint }}
      className={`scanlines pixel-frame group relative flex flex-col bg-cream transition-transform duration-200 ease-out hover:-translate-y-1.5 ${
        visible ? "is-visible animate-rise" : "opacity-0"
      }`}
    >
      {/* Header: class + level */}
      <div className="flex items-center justify-between bg-ink px-3 py-2 font-ui text-[9px] uppercase tracking-wider text-cream">
        <span className="text-[color:var(--tint)]">{member.klass}</span>
        <span>
          Lv<span className="text-gold">.{member.level}</span>
        </span>
      </div>

      {/* Portrait stage */}
      <div className="relative h-56 overflow-hidden border-y-[3px] border-ink">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 120%, color-mix(in srgb, ${member.tint} 55%, transparent), transparent 70%), linear-gradient(180deg, var(--color-parchment), var(--color-sky))`,
          }}
        />
        {/* faint pixel grid on the stage */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#1b2433 0 1px,transparent 1px 16px),repeating-linear-gradient(90deg,#1b2433 0 1px,transparent 1px 16px)",
          }}
        />
        {/* floor line */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-clay/40 to-transparent" />
        <Image
          src={member.img}
          alt={`${member.name}, ${member.role}`}
          unoptimized
          className="pixelated absolute bottom-1 left-1/2 h-52 w-auto -translate-x-1/2 drop-shadow-[2px_3px_0_rgba(27,36,51,0.2)] transition-transform duration-200 group-hover:scale-[1.05]"
        />
      </div>

      {/* Identity */}
      <div className="px-4 pt-3">
        <h3 className="font-display text-3xl font-bold leading-none text-ink">
          {member.name}
        </h3>
        <p className="mt-1 font-ui text-[9px] uppercase tracking-wider text-[color:var(--tint)]">
          {member.role}
        </p>
        <p className="mt-2 min-h-[3.5rem] font-mono text-xs leading-relaxed text-ink-soft">
          {member.blurb}
        </p>
      </div>

      {/* Skill stats */}
      <div className="mt-1 flex flex-col gap-2.5 px-4 pb-5">
        {member.skills.map((skill, si) => (
          <div key={skill.label}>
            <div className="mb-1 flex items-baseline justify-between font-ui text-[8px] uppercase tracking-wider text-ink">
              <span>{skill.label}</span>
              <span className="text-ink-soft">{skill.value}</span>
            </div>
            <div className="statbar">
              <div
                className="fill"
                style={{
                  ["--val" as string]: `${skill.value}%`,
                  ["--c" as string]: member.tint,
                  ["--delay" as string]: `${si * 0.12}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export function TeamRoster() {
  return (
    <section id="team" className="relative scroll-mt-8 px-5 py-24 sm:px-8">
      {/* faint pixel-grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,#1b2433 0 1px,transparent 1px 24px),repeating-linear-gradient(90deg,#1b2433 0 1px,transparent 1px 24px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-ember">
            ── Party Roster ──
          </p>
          <h2 className="mt-3 font-display text-5xl font-bold text-ink [text-shadow:3px_3px_0_rgba(196,122,85,0.4)] sm:text-6xl">
            Choose Your Player
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-ink-soft">
            Every great quest needs the right party. Hover a card to size up
            their stats.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {MEMBERS.map((m) => (
            <PlayerCard key={m.slug} member={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
