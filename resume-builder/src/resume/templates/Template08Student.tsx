import React from "react";
import type { ResumeTemplateProps } from "./types";

export const Template08Student: React.FC<ResumeTemplateProps> = ({ data, palette }) => {
  const b = data.basics;
  return (
    <div className={`p-10 ${palette.text}`}>
      <div className={`rounded-2xl p-6 text-white ${palette.accentBg}`}>
        <h1 className="text-3xl font-extrabold">{b.fullName}</h1>
        <div className="mt-1 text-sm/5 opacity-95">{b.headline}</div>
        <div className="mt-3 text-xs opacity-95">
          {[b.email, b.phone, b.location].filter(Boolean).join(" • ")}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-8">
        <div className="col-span-7">
          {b.summary && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Objective
              </h2>
              <p className="mt-2 text-sm leading-relaxed">{b.summary}</p>
            </section>
          )}

          {data.projects.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Projects
              </h2>
              <div className="mt-3 space-y-4">
                {data.projects.map((p) => (
                  <div key={p.id} className={`rounded-xl border p-4 ${palette.border}`}>
                    <div className={`font-semibold ${palette.heading}`}>{p.name}</div>
                    <div className={`text-xs ${palette.muted}`}>
                      {p.tech}
                      {p.tech && p.link ? " • " : ""}
                      {p.link}
                    </div>
                    <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                      {p.bullets.filter(Boolean).slice(0, 5).map((b2, i) => (
                        <li key={i}>{b2}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.experience.length > 0 && (
            <section>
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Internships / Experience
              </h2>
              <div className="mt-3 space-y-4">
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
                    <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                      {e.bullets.filter(Boolean).slice(0, 5).map((b2, i) => (
                        <li key={i}>{b2}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-5">
          {data.education.length > 0 && (
            <section className="mb-6">
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
                    {ed.details && <div className="text-sm mt-2">{ed.details}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                Skills
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.skills.slice(0, 22).map((s, i) => (
                  <span key={i} className={`text-xs px-2 py-1 rounded-lg border ${palette.border}`}>
                    {s}
                  </span>
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

