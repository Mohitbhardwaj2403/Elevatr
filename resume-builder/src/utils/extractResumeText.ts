/**
 * Extract plain text from resume uploads in the browser.
 * Replaces the old Express + multer flow (no server-side parsing).
 */

function ensureRuntimeCompat() {
  type PromiseWithResolvers = <T>() => {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
  };
  const PromiseCompat = Promise as PromiseConstructor & {
    withResolvers?: PromiseWithResolvers;
  };

  // pdfjs can rely on Promise.withResolvers in some builds/runtimes.
  if (typeof PromiseCompat.withResolvers !== "function") {
    PromiseCompat.withResolvers = function withResolversPolyfill<T>() {
      let resolve!: (value: T | PromiseLike<T>) => void;
      let reject!: (reason?: unknown) => void;
      const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}

export async function extractResumeText(file: File): Promise<string> {
  const lower = file.name.toLowerCase();

  if (lower.endsWith('.txt')) {
    return (await file.text()).trim();
  }

  if (lower.endsWith('.pdf')) {
    ensureRuntimeCompat();

    // Prefer legacy build for broader browser/runtime compatibility.
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const workerMod = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url');
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
