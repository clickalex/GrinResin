/**
 * 404 — kept in the house style, no dead ends.
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="hero hero-notfound">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-copy reveal">
        <p className="micro-label"><span /> Lost between chapters</p>
        <h1>Nothing cured<br /><em>at this address.</em></h1>
        <p className="hero-intro">The page you asked for is not part of the presentation. The reel starts at chapter one, and the demo bench is open too.</p>
        <div className="hero-actions">
          <Link className="amber-button" href="/">Back to the cover <ArrowRight size={16} /></Link>
          <Link className="text-button" href="/demos">Open the working demos <ArrowRight size={15} /></Link>
        </div>
      </div>
      <div className="hero-caption">A name, a flower, a moment—cast to keep.</div>
    </section>
  );
}
