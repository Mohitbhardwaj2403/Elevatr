import React from "react";
import type { ResumeData } from "../types";
import { BulletList, HeaderLine, SectionTitle, safeJoin } from "./shared";

export default function TemplateModern({ data }: { data: ResumeData }) {
  return (
    <div style={{ background: "var(--r-bg)", color: "var(--r-text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 30, fontWeight: 900 }}>{data.basics.fullName || "Your Name"}</div>
          <div style={{ color: "var(--r-accent)", fontWeight: 700, marginTop: 2 }}>
            {data.basics.headline || "Headline / Title"}
          </div>
          <HeaderLine data={data} />
        </div>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 14,
            background: "linear-gradient(135deg, var(--r-accent), var(--r-accent2))",
            opacity: 0.9,
          }}
        />
      </div>

      {data.summary?.trim() && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            border: "1px solid var(--r-border)",
            borderRadius: 12,
            background: "color-mix(in srgb, var(--r-accent) 6%, var(--r-bg))",
          }}
        >
          <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.6 }}>{data.summary}</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <div>
          {data.work?.length > 0 && (
            <>
              <SectionTitle>Experience</SectionTitle>
              {data.work
                .filter((w) => w.company.trim() || w.role.trim())
                .map((w) => (
                  <div key={w.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontWeight: 800 }}>{w.role || "Role"}</div>
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
                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                      {safeJoin([p.link, (p.tech || []).filter(Boolean).join(", ")], " • ")}
                    </div>
                    <BulletList items={p.bullets} />
                  </div>
                ))}
            </>
          )}
        </div>
        <div>
          {data.skills?.length > 0 && (
            <>
              <SectionTitle>Skills</SectionTitle>
              {data.skills
                .filter((g) => g.category?.trim() || (g.skills || []).some((s) => s.trim()))
                .map((g) => (
                  <div
                    key={g.id}
                    style={{
                      border: "1px solid var(--r-border)",
                      borderRadius: 12,
                      padding: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ fontWeight: 800, marginBottom: 4 }}>{g.category || "Skills"}</div>
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
                    <div style={{ fontWeight: 800 }}>{safeJoin([e.degree, e.field], " — ")}</div>
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
        </div>
      </div>
    </div>
  );
}

