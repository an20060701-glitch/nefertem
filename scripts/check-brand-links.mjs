// Check that every official site in data/brands.ts still answers. Run from the repo root:
//   node --experimental-strip-types scripts/check-brand-links.mjs
// One GET per brand, a few at a time, so no site is hammered. Prints the ones to look at.
import { BRANDS } from "../data/brands.ts";

const targets = BRANDS.flatMap((b) => {
  const url = b.site ?? (b.domain && `https://www.${b.domain}/`);
  return url ? [{ key: b.key, url }] : [];
});

async function check({ key, url }) {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
    return { key, url, status: res.status, final: res.url };
  } catch (error) {
    return { key, url, status: "ERR", final: String(error.cause?.code ?? error.message) };
  }
}

const results = [];
for (let i = 0; i < targets.length; i += 6) {
  results.push(...(await Promise.all(targets.slice(i, i + 6).map(check))));
}
const bad = results.filter((r) => r.status === "ERR" || r.status >= 400);
for (const r of results)
  console.log(`${String(r.status).padEnd(4)} ${r.key.padEnd(28)} ${r.url}  →  ${r.final}`);
console.log(`\n${results.length - bad.length}/${results.length} answered.`);
if (bad.length) {
  console.log("Look at:", bad.map((r) => r.key).join(", "));
  console.log("(403 often means the site blocks scripts, not that the page is gone.)");
}
