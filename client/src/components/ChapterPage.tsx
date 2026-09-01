/**
 * Shared chapter-page furniture: the section marker, the page heading, and the
 * prev/next navigation that keeps the vertical story moving between routes.
 */
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { chapterIndexForPath, chapters } from "@/data/presentation";
import { useLocation } from "wouter";

export function SectionMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="section-marker">
      <span>{number}</span>
      <i />
      <p>{label}</p>
    </div>
  );
}

export function ChapterFooter() {
  const [location] = useLocation();
  const index = chapterIndexForPath(location);
  const prev = index > 0 ? chapters[index - 1] : null;
  const next = index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : index === -1 ? chapters[0] : null;
  const position = index >= 0 ? `${index + 1} / ${chapters.length}` : null;

  return (
    <nav className="chapter-nav" aria-label="Chapter navigation">
      {prev ? (
        <Link href={prev.path} className="chapter-nav-link">
          <ArrowLeft size={16} />
          <span><b>{prev.number}</b>{prev.rail}</span>
        </Link>
      ) : (
        <span className="chapter-nav-spacer" />
      )}
      {position && <p className="chapter-nav-position">{position}</p>}
      {next ? (
        <Link href={next.path} className="chapter-nav-link next">
          <span><b>{next.number}</b>{next.rail}</span>
          <ArrowRight size={16} />
        </Link>
      ) : (
        <Link href="/demos" className="chapter-nav-link next">
          <span><b>D</b>Working demos</span>
          <ArrowRight size={16} />
        </Link>
      )}
    </nav>
  );
}

type ChapterPageProps = {
  number: string;
  label: string;
  className?: string;
  children: React.ReactNode;
};

export default function ChapterPage({ number, label, className, children }: ChapterPageProps) {
  return (
    <>
      <section className={`chapter ${className ?? ""}`.trim()}>
        <SectionMarker number={number} label={label} />
        {children}
      </section>
      <ChapterFooter />
    </>
  );
}
