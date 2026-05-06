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

  if (lower.endsWith(".txt")) {
    return (await file.text()).trim();
  }

  if (lower.endsWith(".pdf")) {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // IMPORTANT
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const data = new Uint8Array(await file.arrayBuffer());

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item: any) => item.str || "")
        .join(" ");

      text += pageText + "\n";
    }

    return text.replace(/\s+/g, " ").trim();
  }

  throw new Error("Only PDF and TXT files are supported.");
}