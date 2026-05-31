import type { ReactNode } from "react";

export type LegalBlock =
  | { type: "p"; text: ReactNode }
  | { type: "ul"; items: ReactNode[] }
  | { type: "table"; headers: string[]; rows: ReactNode[][] };

export type LegalSection = {
  title: string;
  blocks: LegalBlock[];
};

type Props = {
  title: string;
  updated: string;
  intro?: ReactNode;
  sections: LegalSection[];
};

export function LegalDocument({ title, updated, intro, sections }: Props) {
  return (
    <article className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted">Last updated: {updated}</p>
        {intro ? <div className="text-muted italic border-l-2 border-neutral-200 pl-3">{intro}</div> : null}
      </header>

      {sections.map((section) => (
        <section key={section.title} className="space-y-2">
          <h2 className="text-lg font-medium">{section.title}</h2>
          {section.blocks.map((block, i) => {
            if (block.type === "p") {
              return (
                <p key={i} className="text-ink/90">
                  {block.text}
                </p>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="list-disc pl-5 space-y-1">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <div key={i} className="overflow-x-auto">
                <table className="w-full text-left border border-neutral-200 text-xs">
                  <thead>
                    <tr className="bg-neutral-50">
                      {block.headers.map((h) => (
                        <th key={h} className="px-2 py-1 border-b border-neutral-200 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-2 py-1 border-b border-neutral-100 align-top">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </section>
      ))}
    </article>
  );
}
