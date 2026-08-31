/**
 * Chapter 10 — The roadmap: six source phases from starter setup to scaled production.
 */
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import ChapterPage from "@/components/ChapterPage";
import { roadmap } from "@/data/presentation";

export default function Roadmap() {
  return (
    <ChapterPage number="10" label="The roadmap" className="roadmap-section">
      <div className="roadmap-backdrop" />
      <div className="roadmap-title reveal">
        <p className="micro-label">Build through evidence</p>
        <h2>From first pour<br />to a <em>durable system.</em></h2>
      </div>
      <div className="roadmap-list">
        {roadmap.map((item, index) => (
          <article className="roadmap-row reveal" key={item.phase}>
            <span className="roadmap-phase">{item.phase}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <ChevronRight size={20} />
            <div className="roadmap-dot" style={{ "--delay": `${index * 0.08}s` } as React.CSSProperties} />
          </article>
        ))}
      </div>
      <Link className="document-inline-link" href="/documents">Read the full roadmap & operating playbook <ArrowUpRight size={16} /></Link>
    </ChapterPage>
  );
}
