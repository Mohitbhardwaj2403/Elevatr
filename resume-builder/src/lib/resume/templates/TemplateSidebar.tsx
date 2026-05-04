import React from "react";
import type { ResumeData } from "../types";
import { BulletList, SectionTitle, safeJoin } from "./shared";

export default function TemplateSidebar({ data }: { data: ResumeData }) {
  const links = (data.basics.links || []).filter((l) => l.url?.trim());

  return (
    <div style={{ background: "var(--r-bg)", color: "var(--r-text)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 18 }}>
        <aside
          style={{
            borderRight: "1px solid var(--r-border)",
            paddingRight: 14,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900 }}>{data.basics.fullName || "Your Name"}</div>
          <div style={{ color: "var(--r-accent)", fontWeight: 800, marginTop: 4 }}>
            {data.basics.headline || "Headline"}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--r-muted)", lineHeight: 1.6 }}>
            {safeJoin([data.basics.email, data.basics.phone, data.basics.location], "\n")}
          </div>

          {links.length > 0 && (
            <>
              <SectionTitle>Links</SectionTitle>
              <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.6 }}>
                {links.map((l, idx) => (
                  <div key={idx}>
                    <span style={{ fontWeight: 700, color: "var(--r-text)" }}>{l.label || "Link"}:</span>{" "}
                    {l.url}
                  </div>
                ))}
              </div>
            </>
          )}

          {data.skills?.length > 0 && (
            <>
              <SectionTitle>Skills</SectionTitle>
              {data.skills
                .filter((g) => g.category?.trim() || (g.skills || []).some((s) => s.trim()))
                .map((g) => (
                  <div key={g.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: 12 }}>{g.category || "Skills"}</div>
                    <div style={{ color: "var(--r-muted)", fontSize: 12, lineHeight: 1.5 }}>
                      {safeJoin(g.skills, ", ")}
                    </div>
                  </div>
                ))}
            </>
          )}
        </aside>

        <main>
          {data.summary?.trim() && (
            <>
              <SectionTitle>Summary</SectionTitle>
              <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.7 }}>{data.summary}</div>
            </>
          )}

          {data.work?.length > 0 && (
            <>
              <SectionTitle>Experience</SectionTitle>
              {data.work
                .filter((w) => w.company.trim() || w.role.trim())
                .map((w) => (
                  <div key={w.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontWeight: 900 }}>{w.role || "Role"}</div>
                      <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                        {safeJoin([w.startDate, w.endDate], " - ")}
                      </div>
                    </div>
                    <div style={{ color: "var(--r-accent)", fontWeight: 700, fontSize: 12 }}>
                      {safeJoin([w.company, w.location], ", ")}
                    </div>
                    <BulletList items={w.bullets} />
                  </div>
                ))}
            </>
          )}

          {data.projects?.length > 0 && (
            <>
              <SectionTitle>Projects</SectionTitle>
              {data.projects
                .filter((p) => p.name.trim())
                .map((p) => (
                  <div key={p.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 900 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                      {safeJoin([p.link, (p.tech || []).filter(Boolean).join(", ")], " • ")}
                    </div>
                    <BulletList items={p.bullets} />
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
                    <div style={{ fontWeight: 900 }}>{safeJoin([e.degree, e.field], " — ")}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                      {safeJoin([e.school, e.location], ", ")}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                      {safeJoin([e.startDate, e.endDate], " - ")}
                      {e.gpa?.trim() ? ` • GPA: ${e.gpa}` : ""}
                    </div>
                  </div>
                ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

