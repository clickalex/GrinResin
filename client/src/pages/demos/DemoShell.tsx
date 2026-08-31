/**
 * Demo shell: chapter rail compatible page frame for working tools.
 */
import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionMarker } from "@/components/ChapterPage";

type Props = {
  title: React.ReactNode;
  intro: string;
  children: React.ReactNode;
  next?: { href: string; label: string };
  className?: string;
};

export default function DemoShell({ title, intro, children, next, className }: Props) {
  return (
    <section className={`chapter demo-section ${className ?? ""}`.trim()}>
      <SectionMarker number="D" label="Working demo" />
      <div className="demo-head reveal">
        <div>
          <p className="micro-label">{intro}</p>
          <h2>{title}</h2>
        </div>
        <Link className="text-button" href="/demos"><ArrowLeft size={15} /> Back to the demo bench</Link>
      </div>
      {children}
      {next && (
        <div className="demo-next">
          <Link className="amber-button" href={next.href}>{next.label} <ArrowRight size={15} /></Link>
        </div>
      )}
    </section>
  );
}
