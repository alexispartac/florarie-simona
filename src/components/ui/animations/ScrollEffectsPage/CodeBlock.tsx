import { useState } from 'react';

type CodeBlockProps = {
  code: string;
  language?: string;
  title?: string;
};

export const CodeBlock = ({ code, language = 'typescript', title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[var(--foreground)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--foreground)] border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[var(--destructive)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--primary)]" />
          </div>
          {title && (
            <span className="ml-3 text-sm text-[var(--muted-foreground)] font-mono">{title}</span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-[var(--primary)] hover:bg-[var(--hover-primary)] text-[var(--primary-foreground)] rounded transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copiat!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiază
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm">
          <code className={`language-${language} text-[var(--primary-foreground)]`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};
