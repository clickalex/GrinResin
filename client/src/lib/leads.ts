/**
 * GrinRex Resin — enquiries (workshop seats, wedding and corporate conversations).
 * Same demo law as orders: stored in the browser, referenced by a code, never sent.
 */
export type Lead = {
  ref: string;
  kind: "wedding" | "corporate" | "workshop" | "contact";
  createdAt: string;
  name: string;
  phone: string;
  city: string;
  detail: string;
  status: "Waiting for reply" | "Seated" | "Quoted";
};

const KEY = "grinrex-leads-v1";

export function readLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Lead[]) : [];
  } catch {
    return [];
  }
}

export function saveLead(lead: Omit<Lead, "ref" | "createdAt" | "status">): Lead {
  const taken = new Set(readLeads().map((l) => l.ref));
  let ref = "";
  do {
    ref = `GRXL-${1000 + Math.floor(Math.random() * 9000)}`;
  } while (taken.has(ref));
  const full: Lead = { ...lead, ref, createdAt: new Date().toISOString(), status: "Waiting for reply" };
  try {
    localStorage.setItem(KEY, JSON.stringify([full, ...readLeads()].slice(0, 80)));
  } catch {
    /* demo store */
  }
  return full;
}

export function dropLead(ref: string): Lead[] {
  const next = readLeads().filter((lead) => lead.ref !== ref);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* demo store */
  }
  return next;
}
