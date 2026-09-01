/**
 * Chapter 13 — The document library. Cards match the sequence; "read in site" opens a
 * paper drawer that fetches and renders the real document file. Downloads are the same file.
 */
import { useEffect, useState } from "react";
import { Download, Sparkles, X } from "lucide-react";
import { Streamdown } from "streamdown";
import ChapterPage from "@/components/ChapterPage";
import { documents, type DocumentEntry } from "@/data/presentation";

export default function Documents() {
  const [openDoc, setOpenDoc] = useState<DocumentEntry | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!openDoc) return;
    let active = true;
    setContent(null);
    setError(null);
    fetch(`/manus-storage/${openDoc.file}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return openDoc.file.endsWith(".json")
          ? response.json().then((json) => "```\n" + JSON.stringify(json, null, 2).slice(0, 120_000) + "\n```")
          : response.text();
      })
      .then((text) => active && setContent(text))
      .catch((cause) => active && setError(String(cause)));
    return () => { active = false; };
  }, [openDoc]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpenDoc(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <ChapterPage number="13" label="One page of requirements" className="library-section">
        <div className="library-title reveal">
          <div>
            <p className="micro-label">One page. No shelf needed</p>
            <h2>The story. The proof.<br /><em>One page of requirements.</em></h2>
          </div>
          <p>The working documents were retired in favour of a single PRD: what the demo covers, the rules its flows obey, and what it deliberately leaves out. Read it here, or download the page.</p>
        </div>
        <div className="document-library">
          {documents.map((item) => (
            <article className="document-card reveal" key={item.id}>
              <div className="document-card-top"><span>{item.number}</span><Sparkles size={17} /></div>
              <p>{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <div className="document-actions">
                <button onClick={() => setOpenDoc(item)}>Read in site</button>
                <a href={`/manus-storage/${item.file}`} download>Download <Download size={15} /></a>
              </div>
            </article>
          ))}
        </div>
      </ChapterPage>

      {openDoc && (
        <div className="document-modal" role="dialog" aria-modal="true" aria-labelledby="document-title">
          <button className="modal-backdrop" aria-label="Close document" onClick={() => setOpenDoc(null)} />
          <article className="document-sheet">
            <button className="close-document" onClick={() => setOpenDoc(null)} aria-label="Close document"><X size={19} /></button>
            <div className="document-sheet-header"><span>{openDoc.number}</span><p>{openDoc.eyebrow}</p></div>
            <h2 id="document-title">{openDoc.title}</h2>
            <div className="document-sheet-copy doc-reader">
              {error && <p className="doc-error">The document file could not be loaded in this environment ({error}). The download link below still saves the source reference.</p>}
              {content === null && !error && <p className="doc-loading">Loading document…</p>}
              {content !== null && <Streamdown>{content}</Streamdown>}
            </div>
            <a className="amber-button" href={`/manus-storage/${openDoc.file}`} download>Download source document <Download size={17} /></a>
          </article>
        </div>
      )}
    </>
  );
}
