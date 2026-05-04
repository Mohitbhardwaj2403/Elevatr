import React from "react";
import type { ResumeTemplateProps } from "./types";

export const Template04Minimal: React.FC<ResumeTemplateProps> = ({ data, palette }) => {
  const b = data.basics;
  return (
    <div className={`p-12 ${palette.text}`}>
      <div className="text-center">
        <h1 className={`text-3xl font-light tracking-[0.25em] ${palette.heading}`}>
          {(b.fullName || "YOUR NAME").toUpperCase()}
        </h1>
        <div className={`mt-3 text-sm ${palette.muted}`}>{b.headline}</div>
        <div className={`mt-4 text-xs ${palette.muted}`}>
          {[b.email, b.phone, b.location].filter(Boolean).join(" • ")}
        </div>
      </div>

      <div className={`mt-8 border-t ${palette.border}`} />

      <div className="mt-8 space-y-7">
        {b.summary && (
          <section>
            <h2 className={`text-xs font-semibold uppercase tracking-widest ${palette.accent}`}>
              Summary
            </h2>
            <p className="mt-2 text-sm leading-relaxed">{b.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2 className={`text-xs font-semibold uppercase tracking-widest ${palette.accent}`}>
              Experience
            </h2>
            <div className="mt-3 space-y-4">
              {data.experience.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className={`text-sm font-semibold ${palette.heading}`}>
                      {e.role} — {e.company}
                    </div>
                    <div className={`text-xs ${palette.muted}`}>
                      {e.start}
                      {e.end ? ` – ${e.end}` : ""}
                    </div>
                  </div>
                  {e.bullets.filter(Boolean).length > 0 && (
                    <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                      {e.bullets.filter(Boolean).slice(0, 5).map((b2, i) => (
                        <li key={i}>{b2}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {data.skills.length > 0 && (
            <section>
              <h2 className={`text-xs font-semibold uppercase tracking-widest ${palette.accent}`}>
                Skills
              </h2>
              <p className="mt-2 text-sm leading-relaxed">{data.skills.join(" • ")}</p>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h2 className={`text-xs font-semibold uppercase tracking-widest ${palette.accent}`}>
                Education
              </h2>
              <div className="mt-2 space-y-2 text-sm">
                {data.education.map((ed) => (
                  <div key={ed.id}>
                    <div className={`font-semibold ${palette.heading}`}>{ed.degree}</div>
                    <div className={palette.muted}>{ed.school}</div>
                    <div className={`text-xs ${palette.muted}`}>
                      {ed.start}
                      {ed.end ? ` – ${ed.end}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

