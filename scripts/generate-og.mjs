// Generates 1200x630 Open Graph images for every blog post into public/og/<slug>.png
// Run: node scripts/generate-og.mjs
// Re-run after adding a new post; existing images are overwritten.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_DIR = join(root, "src/content/blog");
const OUT_DIR = join(root, "public/og");

// Brand tokens lifted from src/styles/tokens.css (light theme — the site default).
const BG = "#fbf8f1"; // hsl(40 30% 98%)
const FG = "#1b1d22"; // hsl(220 10% 12%)
const FG_MUTED = "#5b606b"; // hsl(220 8% 38%)
const ACCENT = "#cf6a1f"; // hsl(20 80% 45%)

// satori accepts ttf/otf/woff (not woff2). Fraunces ships static-weight .woff files;
// Inter only ships as a variable woff2, which satori's parser can't read, so we use
// Fraunces (the site's serif) throughout the card.
const fraunces = (w) =>
  readFileSync(join(root, `node_modules/@fontsource/fraunces/files/fraunces-latin-${w}-normal.woff`));

const fonts = [
  { name: "Fraunces", data: fraunces(600), weight: 600, style: "normal" },
  { name: "Fraunces", data: fraunces(500), weight: 500, style: "normal" },
];

function titleOf(file) {
  const raw = readFileSync(join(BLOG_DIR, file), "utf8");
  const fm = raw.split("---")[1] ?? "";
  const t = fm.match(/^title:\s*"?(.+?)"?\s*$/m);
  const s = fm.match(/^slug:\s*"?(.+?)"?\s*$/m);
  return { title: t?.[1]?.trim(), slug: s?.[1]?.trim() };
}

// The card layout, as a satori VNode tree.
function card(title) {
  return {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BG,
        padding: "72px 80px",
        fontFamily: "Fraunces",
      },
      children: [
        // Brand row: orange "a" badge + wordmark
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: "20px" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: "64px",
                    height: "64px",
                    borderRadius: "9999px",
                    backgroundColor: ACCENT,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Fraunces",
                    fontWeight: 600,
                    fontSize: "42px",
                  },
                  children: "a",
                },
              },
              {
                type: "div",
                props: {
                  style: { fontSize: "34px", fontWeight: 500, color: FG, letterSpacing: "-0.01em" },
                  children: "atomic",
                },
              },
            ],
          },
        },
        // Title
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontFamily: "Fraunces",
              fontWeight: 600,
              fontSize: title.length > 52 ? "64px" : "76px",
              lineHeight: 1.08,
              color: FG,
              letterSpacing: "-0.02em",
              maxWidth: "1040px",
            },
            children: title,
          },
        },
        // Footer rule + url
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: "20px" },
            children: [
              {
                type: "div",
                props: { style: { width: "56px", height: "6px", backgroundColor: ACCENT, borderRadius: "3px" } },
              },
              {
                type: "div",
                props: { style: { fontSize: "26px", color: FG_MUTED }, children: "atomichabitstracker.com" },
              },
            ],
          },
        },
      ],
    },
  };
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
let count = 0;
for (const file of files) {
  const { title, slug } = titleOf(file);
  if (!title || !slug) {
    console.warn(`! skipped ${file} (missing title/slug)`);
    continue;
  }
  const svg = await satori(card(title), { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  writeFileSync(join(OUT_DIR, `${slug}.png`), png);
  count++;
  console.log(`✓ ${slug}.png`);
}
console.log(`\nGenerated ${count} OG image(s) in public/og/`);
