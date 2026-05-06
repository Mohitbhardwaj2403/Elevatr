/**
 * Extract plain text from resume uploads in the browser.
 * Replaces the old Express + multer flow (no server-side parsing).
 */

export async function extractResumeText(file: File): Promise<string> {
  const lower = file.name.toLowerCase();

  if (lower.endsWith(".txt")) {
    return (await file.text()).trim();
  }

  if (lower.endsWith(".pdf")) {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const pdf = await pdfjsLib.getDocument({
      data: await file.arrayBuffer(),
      useWorkerFetch: false,
      isEvalSupported: false,
    }).promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const textContent = await page.getTextContent();

      const items = Array.from(textContent.items);

      for (const item of items as any[]) {
        if (item?.str) {
          text += item.str + " ";
        }
      }

      text += "\n";
    }

    return text.replace(/\s+/g, " ").trim();
  }

  throw new Error("Only PDF and TXT files are supported.");
}