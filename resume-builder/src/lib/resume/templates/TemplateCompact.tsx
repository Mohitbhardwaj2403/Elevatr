import React from "react";
import type { ResumeData } from "../types";
import { BulletList, HeaderLine, SectionTitle, safeJoin } from "./shared";

export default function TemplateCompact({ data }: { data: ResumeData }) {
  return (
    <div style={{ background: "var(--r-bg)", color: "var(--r-text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 900 }}>{data.basics.fullName || "Your Name"}</div>
          <div style={{ fontSize: 13, color: "var(--r-accent)", fontWeight: 800 }}>
            {data.basics.headline || "Headline / Title"}
          </div>
          <HeaderLine data={data} />
        </div>
        <div style={{ width: 10, borderRadius: 999, background: "var(--r-accent)" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
        <div>
          {data.work?.length > 0 && (
            <>
              <SectionTitle>Experience</SectionTitle>
              {data.work
                .filter((w) => w.company.trim() || w.role.trim())
                .slice(0, 4)
                .map((w) => (
                  <div key={w.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 900 }}>{w.role || "Role"}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                      {safeJoin([w.company, w.location], ", ")} • {safeJoin([w.startDate, w.endDate], " - ")}
                    </div>
                    <BulletList items={w.bullets.slice(0, 3)} />
                  </div>
                ))}
            </>
          )}

          {data.projects?.length > 0 && (
            <>
              <SectionTitle>Projects</SectionTitle>
              {data.projects
                .filter((p) => p.name.trim())
                .slice(0, 4)
                .map((p) => (
                  <div key={p.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 900 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                      {safeJoin([p.link, (p.tech || []).filter(Boolean).slice(0, 6).join(", ")], " • ")}
                    </div>
                    <BulletList items={p.bullets.slice(0, 2)} />
                  </div>
                ))}
            </>
          )}
        </div>

        <div>
          {data.summary?.trim() && (
            <>
              <SectionTitle>Summary</SectionTitle>
              <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.6 }}>{data.summary}</div>
            </>
          )}

          {data.skills?.length > 0 && (
            <>
              <SectionTitle>Skills</SectionTitle>
              {data.skills
                .filter((g) => (g.skills || []).some((s) => s.trim()))
                .map((g) => (
                  <div key={g.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 900, fontSize: 12 }}>{g.category || "Skills"}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>{safeJoin(g.skills, ", ")}</div>
                  </div>
                ))}
            </>
          )}

          {data.education?.length > 0 && (
            <>
              <SectionTitle>Education</SectionTitle>
              {data.education
                .filter((e) => e.school.trim() || e.degree.trim())
                .map((e) => (
                  <div key={e.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 900, fontSize: 12 }}>{safeJoin([e.degree, e.field], " — ")}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                      {safeJoin([e.school, e.location], ", ")}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>{safeJoin([e.startDate, e.endDate], " - ")}</div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

