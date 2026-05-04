import React from "react";
import type { ResumeTemplateProps } from "./types";

export const Template06Compact: React.FC<ResumeTemplateProps> = ({ data, palette }) => {
  const b = data.basics;
  return (
    <div className={`p-8 ${palette.text}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-extrabold ${palette.heading}`}>{b.fullName}</h1>
          <div className={`text-sm font-semibold ${palette.accent}`}>{b.headline}</div>
        </div>
        <div className={`text-[11px] ${palette.muted} text-right`}>
          <div>{[b.email, b.phone].filter(Boolean).join(" • ")}</div>
          <div>{[b.location, b.linkedin].filter(Boolean).join(" • ")}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-5">
          {b.summary && (
            <section>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Summary
              </h2>
              <p className="mt-1 text-sm leading-relaxed">{b.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Experience
              </h2>
              <div className="mt-2 space-y-3">
                {data.experience.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className={`text-sm font-semibold ${palette.heading}`}>
                        {e.role}{" "}
                        <span className={palette.muted}>@ {e.company}</span>
                      </div>
                      <div className={`text-[11px] ${palette.muted}`}>
                        {e.start}
                        {e.end ? ` – ${e.end}` : ""}
                      </div>
                    </div>
                    <ul className="mt-1 text-sm list-disc pl-5 space-y-0.5">
                      {e.bullets.filter(Boolean).slice(0, 4).map((b2, i) => (
                        <li key={i}>{b2}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects.length > 0 && (
            <section>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Projects
              </h2>
              <div className="mt-2 space-y-3">
                {data.projects.map((p) => (
                  <div key={p.id}>
                    <div className={`text-sm font-semibold ${palette.heading}`}>{p.name}</div>
                    <div className={`text-[11px] ${palette.muted}`}>
                      {p.tech}
                      {p.tech && p.link ? " • " : ""}
                      {p.link}
                    </div>
                    <ul className="mt-1 text-sm list-disc pl-5 space-y-0.5">
                      {p.bullets.filter(Boolean).slice(0, 3).map((b2, i) => (
                        <li key={i}>{b2}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-5">
          {data.skills.length > 0 && (
            <section>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Skills
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.skills.slice(0, 24).map((s, i) => (
                  <span key={i} className={`text-[11px] px-2 py-1 rounded border ${palette.border}`}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Education
              </h2>
              <div className="mt-2 space-y-2">
                {data.education.map((ed) => (
                  <div key={ed.id}>
                    <div className={`text-sm font-semibold ${palette.heading}`}>{ed.school}</div>
                    <div className={`text-[11px] ${palette.muted}`}>{ed.degree}</div>
                    <div className={`text-[11px] ${palette.muted}`}>
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
              <ul className="mt-2 text-sm space-y-1">
                {data.certifications.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    {c.name}{" "}
                    <span className={palette.muted}>{c.year ? `(${c.year})` : ""}</span>
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

