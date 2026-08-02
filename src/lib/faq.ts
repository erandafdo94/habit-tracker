// Extracts the Q&A pairs from a post's `## FAQ` section so they can be emitted
// as FAQPage structured data. Questions are bold paragraphs (`**...?**`); the
// answer is the prose that follows, up to the next question or the next H2.

export interface FaqItem {
  question: string;
  answer: string;
}

// Turn inline markdown into the plain text schema.org expects: unwrap links,
// drop emphasis markers, collapse whitespace.
function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [label](url) -> label
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, "$1") // italic
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/\s+/g, " ")
    .trim();
}

export function extractFaq(body: string): FaqItem[] {
  const start = body.search(/^##\s+FAQ\s*$/m);
  if (start === -1) return [];

  // Everything from the FAQ heading to the next H2 (or end of file).
  let section = body.slice(start).replace(/^##\s+FAQ\s*$/m, "");
  const nextH2 = section.search(/^##\s+/m);
  if (nextH2 !== -1) section = section.slice(0, nextH2);

  const lines = section.split("\n");
  const items: FaqItem[] = [];
  let current: FaqItem | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    const q = line.match(/^\*\*(.+?)\*\*$/);
    if (q) {
      if (current && current.answer) items.push(current);
      current = { question: stripMarkdown(q[1]), answer: "" };
    } else if (current && line) {
      current.answer = current.answer ? `${current.answer} ${stripMarkdown(line)}` : stripMarkdown(line);
    }
  }
  if (current && current.answer) items.push(current);

  return items;
}
