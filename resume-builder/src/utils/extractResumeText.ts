/**
 * Extract plain text from resume uploads in the browser.
 * Replaces the old Express + multer flow (no server-side parsing).
 */

export async function extractResumeText(file: File): Promise<string> {
  const lower = file.name.toLowerCase();

  if (lower.endsWith('.txt')) {
    return (await file.text()).trim();
  }

  if (lower.endsWith('.pdf')) {
    const pdfjs = await import('pdfjs-dist');
    const workerMod = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = workerMod.default;

    const data = new Uint8Array(await file.arrayBuffer());
    const doc = await pdfjs.getDocument({ data }).promise;
    const parts: string[] = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      for (const item of content.items) {
        if (item && typeof item === 'object' && 'str' in item && typeof (item as { str: string }).str === 'string') {
          parts.push((item as { str: string }).str);
        }
      }
      parts.push('\n');
    }
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  throw new Error(
    'Please upload a PDF or .txt file. Word (.doc/.docx) is not supported here—export to PDF or paste text into a .txt file.',
  );
}
