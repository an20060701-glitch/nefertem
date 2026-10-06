import { afterEach, describe, expect, it, vi } from "vitest";
import { imageCredit } from "./credit";
import { bestProductEntry, bestProductUrl, nameWords, pageImage, parseSitemap } from "./parse";
import { parseRobots } from "./robots";

vi.mock("server-only", () => ({}));

describe("parseRobots", () => {
  const text = [
    "User-agent: *",
    "Disallow: /checkout",
    "Disallow: /*?sort_by=",
    "Allow: /checkout/help",
    "",
    "User-agent: GPTBot",
    "Disallow: /",
    "",
    "Sitemap: https://www.example.com/sitemap.xml",
  ].join("\n");

  it("follows the * group, longest rule first, Allow on a tie", () => {
    const r = parseRobots(text, "NefertemBot");
    expect(r.allows("/products/santal-33")).toBe(true);
    expect(r.allows("/checkout/pay")).toBe(false);
    expect(r.allows("/checkout/help")).toBe(true);
    expect(r.allows("/collections/all?sort_by=price")).toBe(false);
    expect(r.sitemaps).toEqual(["https://www.example.com/sitemap.xml"]);
  });

  it("uses a group named for our agent over *", () => {
    const r = parseRobots(`${text}\nUser-agent: NefertemBot\nDisallow: /products/`, "NefertemBot");
    expect(r.allows("/products/santal-33")).toBe(false);
    expect(r.allows("/checkout/pay")).toBe(true);
  });

  it("stays out when everything is disallowed, and allows all for an empty file", () => {
    expect(parseRobots("User-agent: *\nDisallow: /", "NefertemBot").allows("/products/x")).toBe(false);
    expect(parseRobots("", "NefertemBot").allows("/anything")).toBe(true);
  });
});

describe("parseSitemap", () => {
  it("reads <loc>s, entities and CDATA, and tells an index apart", () => {
    const index = parseSitemap(
      `<sitemapindex><sitemap><loc>https://a.com/sitemap_products_1.xml?from=1&amp;to=2</loc></sitemap></sitemapindex>`,
    );
    expect(index).toMatchObject({
      isIndex: true,
      locs: ["https://a.com/sitemap_products_1.xml?from=1&to=2"],
    });
    const pages = parseSitemap(`<urlset><url><loc><![CDATA[ https://a.com/p/x ]]></loc></url></urlset>`);
    expect(pages).toMatchObject({ isIndex: false, locs: ["https://a.com/p/x"] });
  });
});

describe("image sitemaps", () => {
  const xml = `<urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url><loc>https://x.com/p/12345</loc><image:image><image:loc>https://cdn.x.com/halfeti.jpg</image:loc><image:title>Halfeti Eau de Parfum</image:title></image:image></url>
    <url><loc>https://x.com/p/67890</loc><image:image><image:title><![CDATA[Halfeti Body Lotion]]></image:title></image:image></url>
  </urlset>`;

  it("reads each page's picture and title, and matches on the title", () => {
    const { entries } = parseSitemap(xml);
    expect(entries[0]).toEqual({
      loc: "https://x.com/p/12345",
      image: "https://cdn.x.com/halfeti.jpg",
      title: "Halfeti Eau de Parfum",
    });
    expect(bestProductEntry(entries, "Halfeti")?.loc).toBe("https://x.com/p/12345");
  });
});

describe("bestProductUrl", () => {
  const urls = [
    "https://www.lelabo.com/en/santal-33-candle.html",
    "https://www.lelabo.com/en/santal-33-eau-de-parfum.html",
    "https://www.lelabo.com/en/santal-33-discovery-set.html",
    "https://www.lelabo.com/en/another-13.html",
    "https://www.lelabo.com/en/journal/santal-33-story-of-a-scent.html",
  ];

  it("picks the bottle, not the candle, set or article", () => {
    expect(bestProductUrl(urls, "Santal 33")).toBe("https://www.lelabo.com/en/santal-33-eau-de-parfum.html");
  });

  it("matches accents and run-together slugs", () => {
    expect(bestProductUrl(["https://x.com/products/philosykos-edt"], "Philosykos")).toBe(
      "https://x.com/products/philosykos-edt",
    );
    expect(bestProductUrl(["https://x.com/p/baccaratrouge540"], "Baccarat Rouge 540")).toBe(
      "https://x.com/p/baccaratrouge540",
    );
    expect(bestProductUrl(["https://x.com/p/terre-d-hermes"], "Terre d’Hermès")).toBe(
      "https://x.com/p/terre-d-hermes",
    );
  });

  it("returns nothing when the name is missing or only a set matches", () => {
    expect(bestProductUrl(urls, "Gypsy Water")).toBeUndefined();
    expect(bestProductUrl(["https://x.com/p/aventus-gift-set"], "Aventus")).toBeUndefined();
  });

  it("takes the exact name over a flanker", () => {
    const creed = [
      "https://www.creedfragrance.com/aventus-cologne",
      "https://www.creedfragrance.com/aventus",
    ];
    expect(bestProductUrl(creed, "Aventus")).toBe("https://www.creedfragrance.com/aventus");
    expect(bestProductUrl(creed, "Aventus Cologne")).toBe("https://www.creedfragrance.com/aventus-cologne");
  });

  it("ignores bottle words in the name", () => {
    expect(nameWords("Sauvage Eau de Parfum")).toEqual(["sauvage"]);
  });
});

describe("pageImage", () => {
  const page = "https://www.example.com/products/santal-33";

  it("prefers the schema.org Product image, resolved to https", () => {
    const html = `<meta property="og:image" content="https://cdn.example.com/share.jpg">
      <script type="application/ld+json">{"@graph":[{"@type":"Product","image":["/img/santal.jpg"]}]}</script>`;
    expect(pageImage(html, page)).toBe("https://www.example.com/img/santal.jpg");
  });

  it("falls back to og:image, skips logos and non-https URLs", () => {
    expect(pageImage(`<meta content="//cdn.x.com/a.jpg?w=1&amp;h=2" property="og:image" />`, page)).toBe(
      "https://cdn.x.com/a.jpg?w=1&h=2",
    );
    expect(pageImage(`<meta property="og:image" content="/logo.png">`, page)).toBeUndefined();
    expect(pageImage(`<meta name="twitter:image" content="javascript:alert(1)">`, page)).toBeUndefined();
  });
});

describe("imageCredit", () => {
  it("labels https pages by host and refuses anything else", () => {
    expect(imageCredit("https://www.lelabo.com/p")).toEqual({
      href: "https://www.lelabo.com/p",
      label: "lelabo.com",
    });
    expect(imageCredit("javascript:alert(1)")).toBeUndefined();
    expect(imageCredit(undefined)).toBeUndefined();
  });
});

describe("findOfficialImage", () => {
  afterEach(() => vi.unstubAllGlobals());

  function site(routes: Record<string, string | number>) {
    const calls: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string, init?: RequestInit) => {
        calls.push(input);
        expect((init?.headers as Record<string, string>)["User-Agent"]).toMatch(/^NefertemBot\//);
        const body = routes[input];
        if (body === undefined) return new Response("not found", { status: 404 });
        if (typeof body === "number") return new Response("", { status: body });
        const res = new Response(body, { status: 200 });
        Object.defineProperty(res, "url", { value: input });
        return res;
      }),
    );
    return calls;
  }

  it("follows robots.txt and the product sitemap to the page's own picture", async () => {
    const { findOfficialImage } = await import("./index");
    const calls = site({
      "https://www.diptyqueparis.com/robots.txt":
        "User-agent: *\nDisallow: /cart\nSitemap: https://www.diptyqueparis.com/sitemap.xml",
      "https://www.diptyqueparis.com/sitemap.xml":
        "<sitemapindex><sitemap><loc>https://www.diptyqueparis.com/blog.xml</loc></sitemap><sitemap><loc>https://www.diptyqueparis.com/sitemap_products_1.xml</loc></sitemap></sitemapindex>",
      "https://www.diptyqueparis.com/sitemap_products_1.xml":
        "<urlset><url><loc>https://www.diptyqueparis.com/products/philosykos-candle</loc></url><url><loc>https://www.diptyqueparis.com/products/philosykos-eau-de-toilette</loc></url></urlset>",
      "https://www.diptyqueparis.com/products/philosykos-eau-de-toilette":
        '<meta property="og:image" content="https://www.diptyqueparis.com/cdn/philosykos.jpg">',
    });
    const image = await findOfficialImage({ brand: "Diptyque", name: "Philosykos" });
    expect(image).toEqual({
      imageUrl: "https://www.diptyqueparis.com/cdn/philosykos.jpg",
      pageUrl: "https://www.diptyqueparis.com/products/philosykos-eau-de-toilette",
      brand: "Diptyque",
    });
    // Product sitemap read before the blog one, which was never needed.
    expect(calls.indexOf("https://www.diptyqueparis.com/sitemap_products_1.xml")).toBeLessThan(
      calls.indexOf("https://www.diptyqueparis.com/products/philosykos-eau-de-toilette"),
    );
  });

  it("fetches nothing past robots.txt when the site says no", async () => {
    const { findOfficialImage } = await import("./index");
    const calls = site({ "https://www.byredo.com/robots.txt": "User-agent: *\nDisallow: /" });
    expect(await findOfficialImage({ brand: "Byredo", name: "Gypsy Water" })).toBeNull();
    expect(calls.every((c) => c.endsWith("/robots.txt"))).toBe(true);
  });

  it("returns null for brands it does not know", async () => {
    const { findOfficialImage } = await import("./index");
    const calls = site({});
    expect(await findOfficialImage({ brand: "No Such House", name: "X" })).toBeNull();
    expect(calls).toEqual([]);
  });
});
