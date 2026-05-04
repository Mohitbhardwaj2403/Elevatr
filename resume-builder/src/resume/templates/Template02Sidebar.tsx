import React from "react";
import type { ResumeTemplateProps } from "./types";

export const Template02Sidebar: React.FC<ResumeTemplateProps> = ({ data, palette }) => {
  const b = data.basics;
  return (
    <div className="grid grid-cols-12 min-h-[1050px]">
      <aside className={`col-span-4 p-8 text-white ${palette.accentBg}`}>
        <h1 className="text-2xl font-extrabold leading-tight">
          {b.fullName || "Your Name"}
        </h1>
        <div className="mt-2 text-sm/5 opacity-95">{b.headline || "Your Headline"}</div>

        <div className="mt-6 space-y-1 text-xs opacity-95">
          {b.email && <div>{b.email}</div>}
          {b.phone && <div>{b.phone}</div>}
          {b.location && <div>{b.location}</div>}
          {b.linkedin && <div>{b.linkedin}</div>}
          {b.github && <div>{b.github}</div>}
          {b.website && <div>{b.website}</div>}
        </div>

        {data.skills.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-widest opacity-90">Skills</h2>
            <ul className="mt-3 text-sm space-y-1">
              {data.skills.slice(0, 18).map((s, i) => (
                <li key={i} className="opacity-95">
                  • {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.certifications.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-widest opacity-90">
              Certifications
            </h2>
            <ul className="mt-3 text-sm space-y-1">
              {data.certifications.map((c) => (
                <li key={c.id} className="opacity-95">
                  {c.name}
                  {c.year ? ` • ${c.year}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <main className={`col-span-8 p-10 ${palette.text}`}>
        {b.summary && (
          <section className="mb-6">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
              Summary
            </h2>
            <p className="mt-2 text-sm leading-relaxed">{b.summary}</p>
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
                    <div className={`font-semibold ${palette.heading}`}>
                      {e.role || "Role"}{" "}
                      <span className={palette.muted}>— {e.company || "Company"}</span>
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
          <section className="mb-6">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
              Projects
            </h2>
            <div className="mt-3 space-y-4">
              {data.projects.map((p) => (
                <div key={p.id}>
                  <div className={`font-semibold ${palette.heading}`}>{p.name || "Project"}</div>
                  <div className={`text-xs ${palette.muted}`}>
                    {p.link}
                    {p.link && p.tech ? " • " : ""}
                    {p.tech}
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

        {data.education.length > 0 && (
          <section>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>
              Education
            </h2>
            <div className="mt-3 space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id}>
                  <div className={`font-semibold ${palette.heading}`}>{ed.degree || "Degree"}</div>
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
      </main>
    </div>
  );
};

