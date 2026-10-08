// Copies ThreeUI's liquid-metal button page into components/ui/liquid-metal (the package
// doesn't export it). Run after upgrading @designcodeio/threeui: node scripts/vendor-liquid-metal.mjs
import { readFileSync, writeFileSync } from "node:fs";

const from =
  "node_modules/@designcodeio/threeui/lib-dist/shaders/liquid-metal-button/liquid-metal-button.html.js";
const { version } = JSON.parse(readFileSync("node_modules/@designcodeio/threeui/package.json", "utf8"));
const m = readFileSync(from, "utf8").match(/^const e = (`[\s\S]*`);\nexport \{/);
if (!m) throw new Error(`${from} changed shape; adapt this script`);
writeFileSync(
  "components/ui/liquid-metal/liquid-metal.html.ts",
  `// Vendored from @designcodeio/threeui ${version} (lib-dist/shaders/liquid-metal-button/liquid-metal-button.html.js),
// MIT License, Copyright (c) 2026 Meng To. Kept verbatim; GlassMetalButton adapts it at runtime.
// Re-copy with: node scripts/vendor-liquid-metal.mjs
export const LIQUID_METAL_HTML: string = ${m[1]};
`,
);
