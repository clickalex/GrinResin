/**
 * Chapter 01 — Cover / brand promise. Also the index of the whole reel.
 */
import { ArrowDown, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { Link } from "wouter";
import { chapters } from "@/data/presentation";

const demos = [
  { path: "/demos/catalogue", title: "Catalogue browser", detail: "All 150 source products with search, family filters, and specimen cards." },
  { path: "/demos/pricing", title: "Pricing guardrail", detail: "Cost a piece with the source formula and see every component move." },
  { path: "/demos/order", title: "Custom order builder", detail: "Configure a personalised piece and produce a studio-ready quote sheet." },
  { path: "/demos/track", title: "Order tracker", detail: "Watch a demo reference move through the eight studio states." },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-image" />
        <div className="hero-copy reveal">
          <div className="hero-brand-anchor" aria-label="GrinRex Resin">
            <span className="mark-orbit hero-mark"><span>G</span></span>
            <div><b>GRINREX</b><em>RESIN</em></div>
          </div>
          <p className="micro-label"><span /> GrinRex Resin · presentation 2026</p>
          <h1>Made to keep.<br /><em>Made to grin.</em></h1>
          <p className="hero-intro">A personalized gifting and keepsake brand transforming names, photographs, flowers, and celebrations into objects with staying power.</p>
          <div className="hero-actions">
            <Link className="amber-button" href="/chapters/opportunity">Begin the story <ArrowDown size={17} /></Link>
            <Link className="text-button" href="/documents">Read the overview <ArrowUpRight size={16} /></Link>
          </div>
        </div>
        <div className="hero-aside">
          <p>01 / {String(chapters.length).padStart(2, "0")}</p>
          <span>Personalized resin<br />gifting & keepsakes</span>
        </div>
        <div className="hero-caption">A name, a flower, a moment—cast to keep.</div>
      </section>

      <section className="chapter contents-section">
        <div className="contents-heading reveal">
          <div>
            <p className="micro-label">The complete presentation</p>
            <h2>Thirteen chapters,<br /><em>one vertical reel.</em></h2>
          </div>
          <p>Each chapter is its own page now — move through the story in order, or jump straight to the proof you came for. The amber thread keeps your place.</p>
        </div>
        <div className="contents-grid">
          {chapters.slice(1).map((chapter, index) => (
            <Link key={chapter.number} href={chapter.path} className="contents-card reveal" style={{ animationDelay: `${0.045 * index}s` }}>
              <span className="contents-number">{chapter.number}</span>
              <h3>{chapter.rail}</h3>
              <p>{chapter.blurb}</p>
              <i className="contents-arrow"><ArrowRight size={15} /></i>
            </Link>
          ))}
        </div>

        <div className="demo-strip reveal">
          <div className="demo-strip-top">
            <p className="micro-label"><span /> Working demos</p>
            <Link className="text-button" href="/demos">Enter the demo bench <ArrowRight size={15} /></Link>
          </div>
          <div className="demo-cards">
            {demos.map((demo) => (
              <Link key={demo.path} href={demo.path} className="demo-card">
                <span className="demo-card-play"><Play size={13} /></span>
                <h3>{demo.title}</h3>
                <p>{demo.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
