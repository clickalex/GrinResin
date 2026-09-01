/**
 * GrinRex Resin — site shell: fixed chapter rail (desktop), compact top bar (mobile),
 * amber memory thread, and the footer close. Present on every page of the reel.
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, LayoutGrid, Menu, Palette, ShoppingBag, Tickets, X } from "lucide-react";
import { chapterIndexForPath, chapters } from "@/data/presentation";
import { useCart } from "@/lib/cart";

const DEMO_PATH = "/demos";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { count } = useCart();
  const activeIndex = chapterIndexForPath(location);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

  useEffect(() => {
    const chapter = chapters[activeIndex];
    const title = chapter ? `${chapter.number} · ${chapter.label} — GrinRex Resin` : "Working demos — GrinRex Resin";
    document.title = location === "/" ? "GrinRex Resin — Made to Keep" : title;
  }, [location, activeIndex]);

  return (
    <main className="site-shell">
      <aside className="chapter-rail" aria-label="Presentation chapters">
        <Link href="/" className="rail-mark brand-rail-lockup" aria-label="GrinRex Resin home">
          <span className="mark-orbit"><span>G</span></span>
          <span className="rail-wordmark">GRINREX<br />RESIN</span>
        </Link>
        <div className="rail-track" aria-hidden="true" />
        <nav className="rail-nav">
          {chapters.map((chapter, index) => (
            <Link
              key={chapter.number}
              href={chapter.path}
              title={`${chapter.number} ${chapter.rail}`}
              className={index === activeIndex ? "is-current" : undefined}
            >
              <span>{chapter.number}</span>
              <em>{chapter.rail}</em>
            </Link>
          ))}
          <Link
            href={DEMO_PATH}
            title="D Working demos"
            className={activeIndex === chapters.length ? "is-current demo" : "demo"}
          >
            <span>D</span>
            <em>Working demos</em>
          </Link>
        </nav>
        <div className="rail-store" aria-label="Store shortcuts">
          <Link href="/shop" title="Shop"><LayoutGrid size={14} /></Link>
          <Link href="/studio" title="Design your own"><Palette size={14} /></Link>
          <Link href="/orders" title="My orders"><Tickets size={14} /></Link>
          <Link href="/cart" title="Cart" className="rail-cart"><ShoppingBag size={14} />{count > 0 && <b>{count}</b>}</Link>
        </div>
        <p className="rail-foot">A lasting object<br />for a fleeting moment.</p>
      </aside>

      <header className="mobile-header">
        <Link to="/" className="mobile-mark">
          <span className="mark-orbit"><span>G</span></span>
          <b>GRINREX RESIN</b>
        </Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle presentation menu" aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        {menuOpen && (
          <nav className="mobile-menu">
            {chapters.map((chapter) => (
              <Link key={chapter.number} href={chapter.path}>
                <span>{chapter.number}</span> {chapter.rail}
              </Link>
            ))}
            <Link href={DEMO_PATH}>
              <span>D</span> Working demos
            </Link>
          </nav>
        )}
      </header>

      <div className="page-content" id="top">
        {children}
      </div>

      <footer className="site-footer">
        <Link to="/" className="footer-mark brand-footer-lockup">
          <span className="mark-orbit"><span>G</span></span>
          <b>GRINREX<br /><em>RESIN</em></b>
        </Link>
        <p>A lasting object for a fleeting moment.</p>
        <Link to="/">Back to first chapter <ArrowUpRight size={15} /></Link>
      </footer>
    </main>
  );
}
