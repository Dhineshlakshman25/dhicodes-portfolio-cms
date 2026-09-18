/**
 * Intelligent Blog Article Auto-Formatter
 * Automatically cleans, beautifies, and structures raw pasted text into publication-ready Markdown.
 */

export interface FormattedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  wordCount: number;
  readMinutes: number;
}

/**
 * Clean and convert raw pasted text into polished Markdown
 */
export function autoFormatBlogArticle(rawText: string): FormattedArticle {
  if (!rawText || rawText.trim() === "") {
    return {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      wordCount: 0,
      readMinutes: 1,
    };
  }

  // 1. Standardize newlines and whitespace
  let text = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');

  // 2. Normalize bullet points and dashes
  text = text.replace(/^[•●◦▪]\s*/gm, "- ");
  text = text.replace(/^[—–]\s+/gm, "- ");

  // 3. Normalize callout notes (Note:, Tip:, Warning:, Important:)
  text = text.replace(
    /^(Note|Tip|Warning|Important|Key Takeaway):\s*(.+)$/gim,
    "> **$1:** $2"
  );

  // 4. Split into lines to analyze structure
  const rawLines = text.split("\n").map((l) => l.trimEnd());
  const formattedLines: string[] = [];

  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];

  const isCodeLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    return (
      trimmed.startsWith("import ") ||
      trimmed.startsWith("export ") ||
      trimmed.startsWith("const ") ||
      trimmed.startsWith("let ") ||
      trimmed.startsWith("var ") ||
      trimmed.startsWith("function ") ||
      trimmed.startsWith("class ") ||
      trimmed.startsWith("interface ") ||
      trimmed.startsWith("type ") ||
      trimmed.startsWith("return ") ||
      trimmed.startsWith("console.") ||
      trimmed.startsWith("npm ") ||
      trimmed.startsWith("pnpm ") ||
      trimmed.startsWith("yarn ") ||
      trimmed.startsWith("npx ") ||
      trimmed.startsWith("curl ") ||
      trimmed.startsWith("git ") ||
      trimmed.startsWith("SELECT ") ||
      trimmed.startsWith("INSERT ") ||
      trimmed.startsWith("UPDATE ") ||
      trimmed.startsWith("DELETE ") ||
      /^(<[a-zA-Z0-9]+.*>|<\/[a-zA-Z0-9]+>)$/.test(trimmed) ||
      (trimmed.endsWith(";") && (trimmed.includes("=") || trimmed.includes("(")))
    );
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Check if line toggles code block manually
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        // Closing code block
        formattedLines.push(line);
        inCodeBlock = false;
      } else {
        formattedLines.push(line);
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      formattedLines.push(line);
      continue;
    }

    // Auto-detect code block group (at least 2 consecutive code lines)
    if (isCodeLine(line)) {
      codeBlockBuffer.push(line);
      // Check if next lines are code as well
      const nextLine = i + 1 < rawLines.length ? rawLines[i + 1] : "";
      if (isCodeLine(nextLine) || codeBlockBuffer.length >= 2) {
        // Continue buffering code
        continue;
      } else {
        // Standalone code line or command
        if (codeBlockBuffer.length === 1 && (trimmed.startsWith("npm ") || trimmed.startsWith("pnpm ") || trimmed.startsWith("git "))) {
          formattedLines.push("```bash");
          formattedLines.push(codeBlockBuffer[0]);
          formattedLines.push("```");
        } else {
          formattedLines.push(...codeBlockBuffer);
        }
        codeBlockBuffer = [];
        continue;
      }
      // Flush buffered code lines
      const isTerminal = codeBlockBuffer.some((c) => /^(npm|pnpm|yarn|npx|git|curl)/.test(c.trim()));
      const isSql = codeBlockBuffer.some((c) => /^(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|EXPLAIN|CREATE|DROP|ALTER)/i.test(c.trim()));
      const isDiagram = codeBlockBuffer.some((c) => /[↓→←↑]/.test(c));
      const lang = isTerminal ? "bash" : isSql ? "sql" : isDiagram ? "text" : "typescript";
      formattedLines.push(`\`\`\`${lang}`);
      formattedLines.push(...codeBlockBuffer);
      formattedLines.push("```");
      codeBlockBuffer = [];
    }

    if (!trimmed) {
      formattedLines.push("");
      continue;
    }

    // Section Header Detection:
    // If not already a markdown header (#), and line is short, looks like a title/heading
    const isExistingHeader = /^#{1,6}\s+/.test(trimmed);
    const looksLikeSection =
      !isExistingHeader &&
      trimmed.length <= 90 &&
      !trimmed.endsWith(".") &&
      !trimmed.endsWith(",") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("*") &&
      !trimmed.startsWith(">") &&
      (/^\d+[\.\)]\s+[A-Z]/.test(trimmed) || // e.g. "1. Architecture Overview"
        /^[A-Z][A-Za-z0-9\s—–:&?/'"-]{3,70}$/.test(trimmed) && // Title Case or section phrase
          (i === 0 || rawLines[i - 1]?.trim() === "") && // Preceded by empty line
          (i + 1 < rawLines.length && rawLines[i + 1]?.trim() !== "")); // Followed by content

    if (looksLikeSection) {
      // If numbered heading like "1. Overview", format as "## 1. Overview"
      formattedLines.push(`## ${trimmed.replace(/^#+\s*/, "")}`);
      continue;
    }

    // Key-Value / Definition Bolding: e.g. "Scalability: System handles 10k RPS" -> "**Scalability:** System handles 10k RPS"
    const keyValueMatch = trimmed.match(/^([A-Za-z0-9\s]{3,35}):\s+(.+)$/);
    if (keyValueMatch && !trimmed.startsWith("http") && !trimmed.startsWith(">") && !trimmed.startsWith("-")) {
      formattedLines.push(`**${keyValueMatch[1]}:** ${keyValueMatch[2]}`);
      continue;
    }

    formattedLines.push(line);
  }

  // Flush any leftover code lines
  if (codeBlockBuffer.length > 0) {
    const isTerminal = codeBlockBuffer.some((c) => /^(npm|pnpm|yarn|npx|git|curl)/.test(c.trim()));
    formattedLines.push(isTerminal ? "```bash" : "```typescript");
    formattedLines.push(...codeBlockBuffer);
    formattedLines.push("```");
  }

  // 5. Clean up excessive consecutive empty lines (max 1 empty line between blocks)
  let cleanContent = formattedLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();

  // 6. Extract Title, Slug, and Excerpt
  const contentLines = cleanContent.split("\n").map((l) => l.trim()).filter(Boolean);
  let title = "Tech Article";
  let excerpt = "";

  if (contentLines.length > 0) {
    // Title is the first line, stripped of markdown # and bullets
    const rawTitle = contentLines[0].replace(/^[#*>\-\s]+/, "").trim();
    title = rawTitle.slice(0, 150);

    // If first line in content was not already an H1, format it nicely
    if (!cleanContent.startsWith("# ")) {
      // Replace or prepend
      if (cleanContent.startsWith(`## ${rawTitle}`)) {
        cleanContent = cleanContent.replace(`## ${rawTitle}`, `# ${rawTitle}`);
      } else if (cleanContent.startsWith(rawTitle)) {
        cleanContent = `# ${rawTitle}\n\n` + cleanContent.slice(rawTitle.length).trim();
      }
    }
  }

  // 7. Extract Excerpt (find first non-heading, non-code paragraph)
  for (let i = 1; i < contentLines.length; i++) {
    const line = contentLines[i];
    if (
      !line.startsWith("#") &&
      !line.startsWith("```") &&
      !line.startsWith(">") &&
      !line.startsWith("-") &&
      line.length >= 25
    ) {
      excerpt = line.replace(/[*_`]/g, "").slice(0, 200).trim();
      break;
    }
  }

  if (!excerpt && contentLines.length > 1) {
    excerpt = contentLines[1].replace(/^[#*`_>\-\s]+/, "").slice(0, 180).trim();
  }

  if (!excerpt) {
    excerpt = `${title} — Insights, architecture patterns, and technical write-up.`;
  }

  // 8. Generate URL Slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  // 9. Metrics
  const wordCount = cleanContent.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    title,
    slug,
    excerpt,
    content: cleanContent,
    wordCount,
    readMinutes,
  };
}
