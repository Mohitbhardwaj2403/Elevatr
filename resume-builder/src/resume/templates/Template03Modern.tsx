import React from "react";
import type { ResumeTemplateProps } from "./types";

export const Template03Modern: React.FC<ResumeTemplateProps> = ({ data, palette }) => {
  const b = data.basics;
  return (
    <div className={`p-10 ${palette.text}`}>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h1 className={`text-4xl font-black ${palette.heading}`}>{b.fullName || "Your Name"}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${palette.accentBg}`}>
              {b.headline || "Your Headline"}
            </span>
            {b.location && <span className={`text-xs ${palette.muted}`}>{b.location}</span>}
          </div>
        </div>
        <div className={`text-xs ${palette.muted} text-right space-y-1`}>
          {b.email && <div>{b.email}</div>}
          {b.phone && <div>{b.phone}</div>}
          {b.linkedin && <div>{b.linkedin}</div>}
          {b.github && <div>{b.github}</div>}
          {b.website && <div>{b.website}</div>}
        </div>
      </div>

      <div className={`mt-6 h-1 w-full rounded ${palette.accentBg}`} />

      <div className="mt-6 grid grid-cols-12 gap-8">
        <div className="col-span-7">
          {b.summary && (
            <section className="mb-6">
              <h2 className={`text-sm font-extrabold ${palette.accent}`}>Summary</h2>
              <p className="mt-2 text-sm leading-relaxed">{b.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-sm font-extrabold ${palette.accent}`}>Experience</h2>
              <div className="mt-3 space-y-4">
                {data.experience.map((e) => (
                  <div key={e.id} className={`rounded-xl border p-4 ${palette.border}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className={`font-semibold ${palette.heading}`}>
                        {e.role || "Role"}{" "}
                        <span className={palette.muted}>• {e.company || "Company"}</span>
                      </div>
                      <div className={`text-xs ${palette.muted}`}>
                        {e.start}
                        {e.end ? ` – ${e.end}` : ""}
                      </div>
                    </div>
                    {e.location && <div className={`text-xs ${palette.muted}`}>{e.location}</div>}
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
              <h2 className={`text-sm font-extrabold ${palette.accent}`}>Projects</h2>
              <div className="mt-3 space-y-4">
                {data.projects.map((p) => (
                  <div key={p.id}>
                    <div className={`font-semibold ${palette.heading}`}>{p.name || "Project"}</div>
                    {(p.link || p.tech) && (
                      <div className={`text-xs ${palette.muted}`}>
                        {p.link}
                        {p.link && p.tech ? " • " : ""}
                        {p.tech}
                      </div>
                    )}
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

        <div className="col-span-5">
          {data.skills.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-sm font-extrabold ${palette.accent}`}>Skills</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {data.skills.slice(0, 20).map((s, i) => (
                  <div key={i} className={`text-xs px-2 py-2 rounded-lg border ${palette.border}`}>
                    {s}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-sm font-extrabold ${palette.accent}`}>Education</h2>
              <div className="mt-3 space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id} className={`rounded-xl border p-4 ${palette.border}`}>
                    <div className={`font-semibold ${palette.heading}`}>{ed.degree || "Degree"}</div>
                    <div className={`text-sm ${palette.muted}`}>{ed.school || "School"}</div>
                    <div className={`text-xs ${palette.muted}`}>
                      {ed.start}
                      {ed.end ? ` – ${ed.end}` : ""}
                    </div>
                    {ed.details && <div className="text-sm mt-1">{ed.details}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.achievements.length > 0 && (
            <section>
              <h2 className={`text-sm font-extrabold ${palette.accent}`}>Highlights</h2>
              <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
                {data.achievements.filter(Boolean).slice(0, 8).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

