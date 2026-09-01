/**
 * Working demo — the studio desk. Every wedding enquiry, corporate request,
 * workshop seat booking, and contact note the storefront collects lands in the
 * browser-side lead store (grinrex-leads-v1). This is the view a studio owner
 * would actually work from: count, cycle reply status, remove. Nothing sends.
 */
import { useState } from "react";
import { Inbox, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import DemoShell from "./DemoShell";
import { dropLead, readLeads, saveLead, setLeadStatus, type Lead } from "@/lib/leads";
import { toast } from "sonner";

const kinds: Array<{ id: Lead["kind"]; label: string; note: string }> = [
  { id: "wedding", label: "Weddings", note: "keepsake lots & favours" },
  { id: "corporate", label: "Corporate", note: "bulk gifting, 25+ pieces" },
  { id: "workshop", label: "Workshops", note: "seat bookings" },
  { id: "contact", label: "General", note: "questions & custom asks" },
];

const SAMPLES: Array<Omit<Lead, "ref" | "createdAt" | "status">> = [
  { kind: "wedding", name: "Ananya & Rohan", phone: "+91 98000 00210", city: "Delhi", detail: "Wedding keepsake lot · 60 favour trinket dishes + 2 couple coasters · ceremony 22 Nov" },
  { kind: "corporate", name: "Meridian Coworking", phone: "+91 98000 00884", city: "Gurugram", detail: "Onboarding gifts · 40 pieces · budget band ₹600–₹900 each · desk nameplates considered" },
  { kind: "workshop", name: "Meher K.", phone: "+91 98000 00132", city: "Delhi", detail: "ws-bloom ×2 · beginner pour, Sunday seat" },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function LeadDeskDemo() {
  const [leads, setLeads] = useState<Lead[]>(() => readLeads());

  const refresh = () => {
    setLeads(readLeads());
    toast("Desk refreshed", { description: "Re-read from this browser's lead store." });
  };

  const seed = () => {
    SAMPLES.forEach((sample) => saveLead(sample));
    setLeads(readLeads());
    toast.success("Three sample enquiries filed", { description: "Stored locally, exactly like a real submission." });
  };

  const cycle = (lead: Lead) => {
    const next: Lead["status"] = lead.status === "Waiting for reply" ? (lead.kind === "workshop" ? "Seated" : "Quoted") : "Waiting for reply";
    setLeads(setLeadStatus(lead.ref, next));
  };

  const drop = (lead: Lead) => {
    setLeads(dropLead(lead.ref));
    toast("Enquiry closed and removed", { description: `${lead.ref} · ${lead.name}` });
  };

  const counts = kinds.map((k) => ({ ...k, count: leads.filter((l) => l.kind === k.id).length }));
  const waiting = leads.filter((l) => l.status === "Waiting for reply").length;

  return (
    <DemoShell
      title={<>The studio <em>desk</em></>}
      intro="Working demo · enquiries, bookings, and reply status — browser-local, nothing sent"
      next={{ href: "/weddings", label: "File a wedding enquiry" }}
    >
      <div className="desk-grid reveal">
        {counts.map((cell) => (
          <div className="desk-cell" key={cell.id}>
            <span>{cell.label}</span>
            <b>{cell.count}</b>
            <p>{cell.note}</p>
          </div>
        ))}
      </div>

      <div className="desk-toolbar">
        <p><Inbox size={14} /> {leads.length} on the desk · <b>{waiting}</b> waiting for a reply</p>
        <div>
          <button className="text-button" onClick={refresh}><RefreshCw size={14} /> Re-read storage</button>
          <button className="amber-button small" onClick={seed}><Sparkles size={14} /> File sample enquiries</button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="desk-empty">
          <p>The desk is clear. Fill any form on the site — a wedding enquiry, a corporate request, a workshop seat, a contact note — and it will appear here, referenced and tracked, on this browser only.</p>
        </div>
      ) : (
        <div className="desk-list">
          {leads.map((lead) => (
            <article className="desk-row" key={lead.ref}>
              <div className="desk-ref">
                <b>{lead.ref}</b>
                <span className={`desk-kind ${lead.kind}`}>{lead.kind}</span>
              </div>
              <div className="desk-copy">
                <strong>{lead.name} <em>· {lead.city} · {lead.phone}</em></strong>
                <p>{lead.detail}</p>
                <span className="desk-date">filed {fmtDate(lead.createdAt)}</span>
              </div>
              <div className="desk-tools">
                <button className={`desk-status ${lead.status === "Waiting for reply" ? "wait" : "done"}`} onClick={() => cycle(lead)} title="Cycle reply status">
                  {lead.status}
                </button>
                <button className="cart-remove" onClick={() => drop(lead)} aria-label={`Remove ${lead.ref}`}><Trash2 size={14} /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </DemoShell>
  );
}
