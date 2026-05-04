import React from "react";
import type { ResumeTemplateProps } from "./types";

export const Template09AccentTop: React.FC<ResumeTemplateProps> = ({ data, palette }) => {
  const b = data.basics;
  return (
    <div className={`relative ${palette.text}`}>
      <div className={`h-16 w-full ${palette.accentBg}`} />
      <div className="p-10 pt-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h1 className={`text-3xl font-extrabold ${palette.heading}`}>{b.fullName}</h1>
            <div className={`mt-1 text-sm font-semibold ${palette.accent}`}>{b.headline}</div>
          </div>
          <div className={`text-xs ${palette.muted} text-right space-y-1`}>
            <div>{[b.email, b.phone].filter(Boolean).join(" • ")}</div>
            <div>{[b.location, b.linkedin].filter(Boolean).join(" • ")}</div>
            <div>{[b.github, b.website].filter(Boolean).join(" • ")}</div>
          </div>
        </div>

        <div className={`mt-5 grid grid-cols-12 gap-8`}>
          <div className="col-span-8 space-y-6">
            {b.summary && (
              <section>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                  Summary
                </h2>
                <p className="mt-2 text-sm leading-relaxed">{b.summary}</p>
              </section>
            )}

            {data.experience.length > 0 && (
              <section>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                  Experience
                </h2>
                <div className="mt-3 space-y-4">
                  {data.experience.map((e) => (
                    <div key={e.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <div className={`font-semibold ${palette.heading}`}>
                          {e.role}{" "}
                          <span className={palette.muted}>— {e.company}</span>
                        </div>
                        <div className={`text-xs ${palette.muted}`}>
                          {e.start}
                          {e.end ? ` – ${e.end}` : ""}
                        </div>
                      </div>
                      <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                        {e.bullets.filter(Boolean).slice(0, 6).map((b2, i) => (
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
                <div className="mt-3 space-y-4">
                  {data.projects.map((p) => (
                    <div key={p.id}>
                      <div className={`font-semibold ${palette.heading}`}>{p.name}</div>
                      <div className={`text-xs ${palette.muted}`}>
                        {p.tech}
                        {p.tech && p.link ? " • " : ""}
                        {p.link}
                      </div>
                      <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                        {p.bullets.filter(Boolean).slice(0, 4).map((b2, i) => (
                          <li key={i}>{b2}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="col-span-4 space-y-6">
            {data.skills.length > 0 && (
              <section>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                  Skills
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.skills.slice(0, 20).map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded border ${palette.border}`}>
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
                <div className="mt-3 space-y-3">
                  {data.education.map((ed) => (
                    <div key={ed.id} className={`rounded-xl border p-4 ${palette.border}`}>
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
    </div>
  );
};

