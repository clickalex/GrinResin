/**
 * Shared frame for the store & info pages — rail-compatible, with the store nav strip
 * and the house typography. Keeps every new page feeling like part of the same reel.
 */
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import StoreNav from "@/components/StoreNav";

export default function StorePage({
  label,
  title,
  lead,
  children,
  className,
  aside,
}: {
  label: string;
  title: React.ReactNode;
  lead?: string;
  children: React.ReactNode;
  className?: string;
  aside?: React.ReactNode;
}) {
  return (
    <section className={`chapter store-section ${className ?? ""}`.trim()}>
      <div className="store-marker">
        <span className="mark-orbit"><span>G</span></span>
        <p>{label}</p>
      </div>
      <StoreNav />
      <div className="store-head">
        <div>
          <h2>{title}</h2>
          {lead && <p className="store-lead">{lead}</p>}
        </div>
        {aside ?? (
          <div className="store-head-aside">
            <Link href="/chapters/collection">The brand story behind this page <ArrowUpRight size={14} /></Link>
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
