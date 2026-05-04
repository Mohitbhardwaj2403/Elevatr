import type { ResumeData } from "./types";

export function resumeToText(r: ResumeData): string {
  const lines: string[] = [];
  lines.push(r.basics.fullName);
  if (r.basics.headline) lines.push(r.basics.headline);
  const contact = [
    r.basics.email,
    r.basics.phone,
    r.basics.location,
    r.basics.website,
    r.basics.linkedin,
    r.basics.github,
  ].filter(Boolean);
  if (contact.length) lines.push(contact.join(" | "));
  lines.push("");

  if (r.basics.summary) {
    lines.push("SUMMARY");
    lines.push(r.basics.summary);
    lines.push("");
  }

  if (r.skills.length) {
    lines.push("SKILLS");
    lines.push(r.skills.join(", "));
    lines.push("");
  }

  if (r.experience.length) {
    lines.push("EXPERIENCE");
    for (const e of r.experience) {
      lines.push(`${e.role} — ${e.company}${e.location ? ` (${e.location})` : ""}`);
      lines.push(`${e.start}${e.end ? ` - ${e.end}` : ""}`);
      for (const b of e.bullets.filter(Boolean)) lines.push(`- ${b}`);
      lines.push("");
    }
  }

  if (r.projects.length) {
    lines.push("PROJECTS");
    for (const p of r.projects) {
      lines.push(`${p.name}${p.link ? ` — ${p.link}` : ""}`);
      if (p.tech) lines.push(`Tech: ${p.tech}`);
      for (const b of p.bullets.filter(Boolean)) lines.push(`- ${b}`);
      lines.push("");
    }
  }

  if (r.education.length) {
    lines.push("EDUCATION");
    for (const ed of r.education) {
      lines.push(`${ed.degree} — ${ed.school}${ed.location ? ` (${ed.location})` : ""}`);
      lines.push(`${ed.start}${ed.end ? ` - ${ed.end}` : ""}`);
      if (ed.details) lines.push(ed.details);
      lines.push("");
    }
  }

  if (r.certifications.length) {
    lines.push("CERTIFICATIONS");
    for (const c of r.certifications) {
      lines.push(`${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`);
    }
    lines.push("");
  }

  if (r.achievements.length) {
    lines.push("ACHIEVEMENTS");
    for (const a of r.achievements.filter(Boolean)) lines.push(`- ${a}`);
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

