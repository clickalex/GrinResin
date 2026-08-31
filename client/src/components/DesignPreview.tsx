/**
 * GrinRex Resin — live SVG renderer for a custom design.
 * One component serves the studio canvas (interactive: place, drag, select inclusions)
 * and every static preview (cart, designs, order pages, saved-design exports).
 */
import { useRef } from "react";
import { useId } from "react";
import React from "react";
import type { Design, DesignInclusion, EffectPreset } from "@/lib/design";
import { hashString } from "@/lib/costing";

const C = 240; // viewBox center
const R = 190;

function shapePath(shape: Design["shape"]): { tag: "path" | "circle" | "rect" | "polygon"; attrs: Record<string, string | number> } {
  switch (shape) {
    case "circle":
      return { tag: "circle", attrs: { cx: C, cy: C, r: R } };
    case "square":
      return { tag: "rect", attrs: { x: 52, y: 52, width: 376, height: 376, rx: 46 } };
    case "hex": {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return `${(C + (R + 6) * Math.cos(a)).toFixed(1)},${(C + (R + 6) * Math.sin(a)).toFixed(1)}`;
      }).join(" ");
      return { tag: "polygon", attrs: { points: pts } };
    }
    case "tablet":
      return { tag: "rect", attrs: { x: 62, y: 128, width: 356, height: 224, rx: 30 } };
    case "heart":
      return { tag: "path", attrs: { d: "M240 402 C 96 306, 66 168, 168 126 C 224 104, 240 156, 240 172 C 240 156, 256 104, 312 126 C 414 168, 384 306, 240 402 Z" } };
    case "droplet":
    default:
      return { tag: "path", attrs: { d: "M240 64 C 336 176, 402 258, 402 316 A 162 162 0 1 1 78 316 C 78 258, 144 176, 240 64 Z" } };
  }
}

function ShapeElement({ d, fill, extra }: { d: Design; fill: string; extra?: Record<string, string | number> }) {
  const { tag, attrs } = shapePath(d.shape);
  return React.createElement(tag, { ...attrs, fill, ...(extra ?? {}) });
}

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FONT_STACK: Record<Design["textFont"], string> = {
  serif: "'Cormorant Garamond', Georgia, serif",
  script: "'Cormorant Garamond', Georgia, serif",
  sans: "'DM Sans', Arial, sans-serif",
};
const TEXT_COLOR: Record<Design["textColor"], string> = { chalk: "#f6f0e7", ink: "#16171a", amber: "#f2bd69" };
const SIZE_PX: Record<Design["textSize"], number> = { sm: 24, md: 34, lg: 46 };

function InclusionGlyph({ item, accent }: { item: DesignInclusion; accent: string }) {
  const soft = "#f6f0e7";
  switch (item.kind) {
    case "petal":
      return <path d="M0,-15 C 11,-6 11,7 0,15 C -11,7 -11,-6 0,-15 Z" fill={accent} opacity={0.92} />;
    case "leaf":
      return (
        <>
          <path d="M0,-17 C 13,-8 13,8 0,17 C -13,8 -13,-8 0,-17 Z" fill="#9eaa87" opacity={0.9} />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#5d684c" strokeWidth={1.2} opacity={0.65} />
        </>
      );
    case "foil":
      return <polygon points="0,-11 9,-4 7,9 -7,11 -10,-2" fill="#d9983a" opacity={0.94} />;
    case "bead":
      return <circle r={6.5} fill={soft} opacity={0.9} />;
    case "star": {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const r = i % 2 === 0 ? 11 : 4.4;
        const a = (Math.PI / 5) * i - Math.PI / 2;
        return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
      }).join(" ");
      return <polygon points={pts} fill="#f2bd69" opacity={0.92} />;
    }
    case "butterfly":
      return (
        <g opacity={0.9}>
          <ellipse cx={-7} cy={-2} rx={7.5} ry={5.5} fill={soft} transform="rotate(-18)" />
          <ellipse cx={7} cy={-2} rx={7.5} ry={5.5} fill={soft} transform="rotate(18)" />
          <ellipse cx={-5.5} cy={6} rx={5} ry={3.6} fill={accent} transform="rotate(14)" />
          <ellipse cx={5.5} cy={6} rx={5} ry={3.6} fill={accent} transform="rotate(-14)" />
          <line x1={0} y1={-6} x2={0} y2={9} stroke="#3a3a36" strokeWidth={1.4} />
        </g>
      );
    case "ring":
      return <circle r={8.5} fill="none" stroke="#d9983a" strokeWidth={3} opacity={0.95} />;
    default:
      return null;
  }
}

export type DesignPreviewProps = {
  design: Design;
  className?: string;
  interactive?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onMove?: (id: string, x: number, y: number) => void;
};

export default function DesignPreview({ design, className, interactive, selectedId, onSelect, onMove }: DesignPreviewProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef<{ id: string; moved: boolean } | null>(null);

  const fillId = `fill-${uid}`;
  const clipId = `clip-${uid}`;
  const rand = mulberry(hashString(design.id || "grx"));
  const sparkles =
    design.effect === "glitter" || design.effect === "galaxy"
      ? Array.from({ length: 26 }, () => ({ x: 60 + rand() * 360, y: 60 + rand() * 360, r: 0.9 + rand() * 2.1, o: 0.25 + rand() * 0.6 }))
      : [];

  const baseFill = (effect: EffectPreset): string => {
    if (effect === "clear") return `url(#${fillId})`;
    if (effect === "marble" || effect === "sunset" || effect === "ocean" || effect === "glitter" || effect === "galaxy") return `url(#${fillId})`;
    return design.tint;
  };

  const startDrag = (event: React.PointerEvent, item: DesignInclusion) => {
    if (!interactive) return;
    event.stopPropagation();
    onSelect?.(item.id);
    dragging.current = { id: item.id, moved: false };
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };
  const moveDrag = (event: React.PointerEvent) => {
    if (!interactive || !dragging.current || !onMove || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.min(94, Math.max(6, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(94, Math.max(6, ((event.clientY - rect.top) / rect.height) * 100));
    dragging.current.moved = true;
    onMove(dragging.current.id, Math.round(x * 10) / 10, Math.round(y * 10) / 10);
  };
  const endDrag = () => { dragging.current = null; };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 480 480"
      className={className}
      role="img"
      aria-label={`Design preview: ${design.name}`}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onClick={() => interactive && onSelect?.(null)}
    >
      <defs>
        <radialGradient id={`${fillId}-g`} cx="34%" cy="26%" r="90%">
          <stop offset="0%" stopColor={design.tint} stopOpacity={design.finish === "gloss" ? 0.62 : 0.44} />
          <stop offset="55%" stopColor={design.tint} stopOpacity={design.effect === "clear" ? 0.3 : 0.5} />
          <stop offset="100%" stopColor={design.effect === "galaxy" ? "#0c0d10" : "#101112"} stopOpacity={0.72} />
        </radialGradient>
        <linearGradient id={`${fillId}-v`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={design.tint} />
          <stop offset="58%" stopColor={design.accent} stopOpacity={0.55} />
          <stop offset="100%" stopColor="#20211e" />
        </linearGradient>
        <linearGradient id={`${fillId}-o`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9eaa87" />
          <stop offset="70%" stopColor={design.tint} stopOpacity={0.85} />
          <stop offset="100%" stopColor="#101112" />
        </linearGradient>
        <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={design.tint} stopOpacity={design.effect === "clear" ? 0.26 : 0.85} />
          <stop offset="100%" stopColor="#101112" stopOpacity={design.effect === "clear" ? 0.5 : 0.92} />
        </linearGradient>
        <clipPath id={clipId}>
          <ShapeElement d={design} fill="#fff" />
        </clipPath>
      </defs>

      {/* the cast itself */}
      {design.effect === "sunset" && <ShapeElement d={design} fill={`url(#${fillId}-v)`} />}
      {design.effect === "ocean" && <ShapeElement d={design} fill={`url(#${fillId}-o)`} />}
      {design.effect === "galaxy" && <ShapeElement d={design} fill={`url(#${fillId}-g)`} />}
      {(design.effect === "clear" || design.effect === "marble" || design.effect === "glitter") && (
        <ShapeElement d={design} fill={baseFill(design.effect)} />
      )}

      <g clipPath={`url(#${clipId})`}>
        {design.effect === "marble" && (
          <>
            <ellipse cx={150 + rand() * 60} cy={150} rx={130} ry={64} fill={design.accent} opacity={0.34} transform={`rotate(${-24 + rand() * 40} 240 240)`} />
            <ellipse cx={330} cy={322} rx={150} ry={58} fill="#9eaa87" opacity={0.32} transform={`rotate(${18 - rand() * 30} 240 240)`} />
            <ellipse cx={240} cy={240} rx={210} ry={54} fill={design.tint} opacity={0.3} transform={`rotate(${44} 240 240)`} />
          </>
        )}
        {sparkles.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={design.effect === "galaxy" ? "#f2e2b8" : "#f6f0e7"} opacity={s.o * (design.effect === "galaxy" ? 0.9 : 0.6)} />
        ))}

        {/* inclusions, suspended */}
        {design.inclusions.map((item) => (
          <g
            key={item.id}
            transform={`translate(${(item.x / 100) * 480} ${(item.y / 100) * 480}) rotate(${item.rot}) scale(${item.scale})`}
            style={{ cursor: interactive ? "grab" : undefined, touchAction: interactive ? "none" : undefined }}
            onPointerDown={(event) => startDrag(event, item)}
            onClick={(event) => { if (interactive) { event.stopPropagation(); onSelect?.(item.id); } }}
          >
            <InclusionGlyph item={item} accent={design.accent} />
            {interactive && selectedId === item.id && (
              <circle r={18} fill="none" stroke="#f2bd69" strokeWidth={1.4} strokeDasharray="4 4" />
            )}
          </g>
        ))}

        {/* cast text */}
        {design.text.trim() && (
          <text
            x={C}
            y={design.shape === "tablet" ? 252 : 316}
            textAnchor="middle"
            fill={TEXT_COLOR[design.textColor]}
            fontFamily={FONT_STACK[design.textFont]}
            fontSize={SIZE_PX[design.textSize]}
            fontStyle={design.textFont === "script" ? "italic" : "normal"}
            letterSpacing={design.textFont === "sans" ? "0.14em" : "0.06em"}
            opacity={0.95}
            style={{ textTransform: design.textFont === "sans" ? "uppercase" : "none" }}
          >
            {design.text.trim().slice(0, 30)}
          </text>
        )}

        {/* light on the surface */}
        {design.finish === "gloss" && (
          <>
            <ellipse cx={168} cy={120} rx={120} ry={64} fill="#ffffff" opacity={0.14} transform="rotate(-24 168 120)" />
            <path d="M96 148 C 150 84, 262 66, 330 84" stroke="#ffffff" strokeOpacity={0.28} strokeWidth={5} fill="none" strokeLinecap="round" />
          </>
        )}
        {design.finish === "matte" && <rect x="0" y="0" width="480" height="480" fill="#101112" opacity={0.14} />}
      </g>

      {/* cured rim */}
      <ShapeElement d={design} fill="none" extra={{ stroke: "rgba(242,189,105,.65)", strokeWidth: 2.5 }} />
      <ShapeElement d={design} fill="none" extra={{ stroke: "rgba(246,240,231,.25)", strokeWidth: 1, transform: "scale(.965)", transformOrigin: "240px 240px" }} />
    </svg>
  );
}

/** Serialize the studio's live SVG element for download. */
export function designToSvgString(svg: SVGSVGElement | null): string {
  if (!svg) return "";
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "960");
  clone.setAttribute("height", "960");
  clone.removeAttribute("class");
  const source = new XMLSerializer().serializeToString(clone);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${source}`;
}

export function downloadText(filename: string, text: string, mime = "image/svg+xml") {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
