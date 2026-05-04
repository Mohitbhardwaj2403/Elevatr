import React from "react";
import type { ResumeTemplateProps } from "./types";

export const Template01Classic: React.FC<ResumeTemplateProps> = ({ data, palette }) => {
  const b = data.basics;
  return (
    <div className={`p-10 ${palette.text}`}>
      <div className={`border-b-2 pb-4 mb-6 ${palette.border}`}>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className={`text-3xl font-extrabold tracking-tight ${palette.heading}`}>
              {b.fullName || "Your Name"}
            </h1>
            <p className={`mt-1 text-sm font-semibold ${palette.accent}`}>
              {b.headline || "Your Headline"}
            </p>
          </div>
          <div className={`text-right text-xs ${palette.muted} space-y-1`}>
            {b.email && <div>{b.email}</div>}
            {b.phone && <div>{b.phone}</div>}
            {b.location && <div>{b.location}</div>}
            {b.linkedin && <div>{b.linkedin}</div>}
            {b.github && <div>{b.github}</div>}
            {b.website && <div>{b.website}</div>}
          </div>
        </div>
      </div>

      {b.summary && (
        <section className="mb-6">
          <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
            Summary
          </h2>
          <p className="mt-2 text-sm leading-relaxed">{b.summary}</p>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
            Skills
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.skills.map((s, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 rounded border ${palette.border}`}
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
            Experience
          </h2>
          <div className="mt-3 space-y-4">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <div className={`font-semibold ${palette.heading}`}>
                      {e.role || "Role"}{" "}
                      <span className={palette.muted}>
                        — {e.company || "Company"}
                      </span>
                    </div>
                    <div className={`text-xs ${palette.muted}`}>{e.location}</div>
                  </div>
                  <div className={`text-xs whitespace-nowrap ${palette.muted}`}>
                    {e.start}
                    {e.end ? ` – ${e.end}` : ""}
                  </div>
                </div>
                {e.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                    {e.bullets.filter(Boolean).map((b2, i) => (
                      <li key={i}>{b2}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {data.education.length > 0 && (
          <section>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
              Education
            </h2>
            <div className="mt-3 space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id}>
                  <div className={`font-semibold ${palette.heading}`}>
                    {ed.degree || "Degree"}
                  </div>
                  <div className={`text-sm ${palette.muted}`}>
                    {ed.school || "School"} {ed.location ? `• ${ed.location}` : ""}
                  </div>
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

        {(data.projects.length > 0 || data.certifications.length > 0) && (
          <section>
            {data.projects.length > 0 && (
              <>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                  Projects
                </h2>
                <div className="mt-3 space-y-3">
                  {data.projects.map((p) => (
                    <div key={p.id}>
                      <div className={`font-semibold ${palette.heading}`}>
                        {p.name || "Project"}
                      </div>
                      {(p.link || p.tech) && (
                        <div className={`text-xs ${palette.muted}`}>
                          {p.link}
                          {p.link && p.tech ? " • " : ""}
                          {p.tech}
                        </div>
                      )}
                      {p.bullets.filter(Boolean).length > 0 && (
                        <ul className="mt-1 text-sm list-disc pl-5 space-y-1">
                          {p.bullets.filter(Boolean).map((b2, i) => (
                            <li key={i}>{b2}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {data.certifications.length > 0 && (
              <div className={data.projects.length ? "mt-6" : ""}>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
                  Certifications
                </h2>
                <ul className="mt-3 text-sm space-y-1">
                  {data.certifications.map((c) => (
                    <li key={c.id}>
                      <span className="font-medium">{c.name}</span>{" "}
                      <span className={palette.muted}>
                        {c.issuer ? `— ${c.issuer}` : ""} {c.year ? `(${c.year})` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

