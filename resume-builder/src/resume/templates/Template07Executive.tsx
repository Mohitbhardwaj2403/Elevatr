import React from "react";
import type { ResumeTemplateProps } from "./types";

export const Template07Executive: React.FC<ResumeTemplateProps> = ({ data, palette }) => {
  const b = data.basics;
  return (
    <div className={`p-10 ${palette.text}`}>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h1 className={`text-4xl font-extrabold ${palette.heading}`}>{b.fullName}</h1>
          <div className={`mt-2 text-base font-semibold ${palette.accent}`}>{b.headline}</div>
          <div className={`mt-2 text-xs ${palette.muted}`}>
            {[b.email, b.phone, b.location].filter(Boolean).join(" • ")}
          </div>
        </div>
        <div className="w-40">
          <div className={`h-1 w-full rounded ${palette.accentBg}`} />
          <div className={`mt-3 text-xs ${palette.muted} space-y-1`}>
            {b.linkedin && <div>{b.linkedin}</div>}
            {b.github && <div>{b.github}</div>}
            {b.website && <div>{b.website}</div>}
          </div>
        </div>
      </div>

      <div className={`mt-6 border-t ${palette.border}`} />

      <div className="mt-6 grid grid-cols-12 gap-8">
        <div className="col-span-8">
          {b.summary && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Executive Summary
              </h2>
              <p className="mt-2 text-sm leading-relaxed">{b.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Professional Experience
              </h2>
              <div className="mt-3 space-y-5">
                {data.experience.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className={`font-semibold ${palette.heading}`}>
                        {e.role} — {e.company}
                      </div>
                      <div className={`text-xs ${palette.muted}`}>
                        {e.start}
                        {e.end ? ` – ${e.end}` : ""}
                      </div>
                    </div>
                    {e.location && <div className={`text-xs ${palette.muted}`}>{e.location}</div>}
                    <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                      {e.bullets.filter(Boolean).slice(0, 7).map((b2, i) => (
                        <li key={i}>{b2}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.achievements.length > 0 && (
            <section>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Leadership Highlights
              </h2>
              <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
                {data.achievements.filter(Boolean).slice(0, 10).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="col-span-4">
          {data.skills.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Core Skills
              </h2>
              <div className="mt-3 space-y-2">
                {data.skills.slice(0, 14).map((s, i) => (
                  <div key={i} className={`text-sm border-l-2 pl-3 ${palette.border}`}>
                    {s}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Education
              </h2>
              <div className="mt-3 space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id}>
                    <div className={`font-semibold ${palette.heading}`}>{ed.school}</div>
                    <div className={`text-sm ${palette.muted}`}>{ed.degree}</div>
                    <div className={`text-xs ${palette.muted}`}>
                      {ed.start}
                      {ed.end ? ` – ${ed.end}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications.length > 0 && (
            <section>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Certifications
              </h2>
              <ul className="mt-3 text-sm space-y-1">
                {data.certifications.map((c) => (
                  <li key={c.id}>
                    {c.name}{" "}
                    <span className={palette.muted}>
                      {c.year ? `(${c.year})` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

