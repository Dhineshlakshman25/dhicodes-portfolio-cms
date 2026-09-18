"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Clean, lightweight, zero-dependency Markdown renderer tailored for technical portfolio blogs.
 * Accurately formats headings, fenced code blocks with copy-button, lists, blockquotes, bold/italic, and links.
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content || content.trim() === "") {
    return <p className="text-xs opacity-50 italic">No content to display.</p>;
  }

  // Parse lines into structured blocks
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Array<{
    type: "h1" | "h2" | "h3" | "h4" | "code" | "blockquote" | "list" | "p";
    content: string;
    lang?: string;
    items?: string[];
  }> = [];

  let inCode = false;
  let codeLang = "";
  let codeBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({
        type: "list",
        content: "",
        items: [...listBuffer],
      });
      listBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code block fences
    if (trimmed.startsWith("```")) {
      flushList();
      if (inCode) {
        // Close code block
        blocks.push({
          type: "code",
          content: codeBuffer.join("\n"),
          lang: codeLang || "code",
        });
        codeBuffer = [];
        inCode = false;
        codeLang = "";
      } else {
        // Open code block
        inCode = true;
        codeLang = trimmed.replace(/^```/, "").trim();
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    // Unordered List item
    if (/^[*\-+]\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[*\-+]\s+/, ""));
      continue;
    }

    // Numbered List item
    if (/^\d+\.\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^\d+\.\s+/, ""));
      continue;
    }

    // If we were in a list and hit non-list line
    flushList();

    if (!trimmed) {
      continue;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "h1", content: trimmed.replace(/^#\s+/, "") });
    } else if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", content: trimmed.replace(/^##\s+/, "") });
    } else if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", content: trimmed.replace(/^###\s+/, "") });
    } else if (trimmed.startsWith("#### ")) {
      blocks.push({ type: "h4", content: trimmed.replace(/^####\s+/, "") });
    } else if (trimmed.startsWith("> ")) {
      blocks.push({ type: "blockquote", content: trimmed.replace(/^>\s+/, "") });
    } else {
      blocks.push({ type: "p", content: trimmed });
    }
  }

  flushList();
  if (inCode && codeBuffer.length > 0) {
    blocks.push({
      type: "code",
      content: codeBuffer.join("\n"),
      lang: codeLang || "code",
    });
  }

  return (
    <div className={`space-y-4 text-[var(--theme-text)] ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            return (
              <h1
                key={idx}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-3 pb-2 border-b"
                style={{ borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)" }}
              >
                <InlineText text={block.content} />
              </h1>
            );

          case "h2":
            return (
              <h2
                key={idx}
                className="text-xl sm:text-2xl font-bold tracking-tight pt-5 pb-1 flex items-center gap-2"
                style={{ color: "var(--theme-text)" }}
              >
                <span
                  className="w-2 h-6 rounded-full inline-block"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                />
                <InlineText text={block.content} />
              </h2>
            );

          case "h3":
            return (
              <h3
                key={idx}
                className="text-base sm:text-lg font-bold pt-3"
                style={{ color: "var(--theme-text)" }}
              >
                <InlineText text={block.content} />
              </h3>
            );

          case "h4":
            return (
              <h4
                key={idx}
                className="text-sm font-semibold uppercase tracking-wider opacity-80 pt-2"
                style={{ color: "var(--theme-primary)" }}
              >
                <InlineText text={block.content} />
              </h4>
            );

          case "blockquote":
            return (
              <blockquote
                key={idx}
                className="p-3.5 rounded-2xl border-l-4 my-3 text-xs sm:text-sm leading-relaxed italic"
                style={{
                  borderLeftColor: "var(--theme-primary)",
                  backgroundColor: "color-mix(in srgb, var(--theme-primary) 8%, transparent)",
                }}
              >
                <InlineText text={block.content} />
              </blockquote>
            );

          case "code":
            return <CodeBlock key={idx} code={block.content} lang={block.lang} />;

          case "list":
            return (
              <ul key={idx} className="space-y-1.5 my-2 pl-2">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: "var(--theme-primary)" }}
                    />
                    <div className="flex-1">
                      <InlineText text={item} />
                    </div>
                  </li>
                ))}
              </ul>
            );

          case "p":
          default:
            return (
              <p
                key={idx}
                className="text-xs sm:text-sm leading-relaxed opacity-90 my-2"
                style={{ color: "var(--theme-text)" }}
              >
                <InlineText text={block.content} />
              </p>
            );
        }
      })}
    </div>
  );
}

/**
 * Fenced Code Block with Copy Action
 */
function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden my-3 shadow-lg"
      style={{
        backgroundColor: "#0d1117",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="uppercase text-[11px] tracking-wider text-zinc-300 font-semibold">
            {lang || "code"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Text */}
      <pre className="p-4 text-xs sm:text-[13px] font-mono leading-relaxed text-emerald-200/90 overflow-x-auto selection:bg-emerald-900/50">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`, and [links](url)
 */
function InlineText({ text }: { text: string }) {
  if (!text) return null;

  // Tokenize bold, code, links, and italic
  // Regex matches:
  // 1. `code`
  // 2. **bold**
  // 3. *italic*
  // 4. [text](url)
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;

        // Inline Code `...`
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 rounded-md font-mono text-[11px] sm:text-xs font-semibold mx-0.5 border"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary) 12%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-primary) 25%, transparent)",
                color: "var(--theme-primary)",
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        // Bold **...**
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={idx} className="font-bold text-[var(--theme-text)]">
              {part.slice(2, -2)}
            </strong>
          );
        }

        // Italic *...*
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return (
            <em key={idx} className="italic opacity-90">
              {part.slice(1, -1)}
            </em>
          );
        }

        // Link [text](url)
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={idx}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold underline decoration-[var(--theme-primary)] hover:opacity-80 transition"
              style={{ color: "var(--theme-primary)" }}
            >
              <span>{linkMatch[1]}</span>
              <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-70" />
            </a>
          );
        }

        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}
