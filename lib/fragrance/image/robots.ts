/**
 * A small robots.txt reader (RFC 9309): the group for our user agent, or `*`,
 * decides; the longest matching rule wins and Allow wins a tie.
 */
export interface RobotsRules {
  allows(path: string): boolean;
  sitemaps: string[];
}

interface Rule {
  allow: boolean;
  pattern: string;
}

function toRegExp(pattern: string): RegExp {
  const anchored = pattern.endsWith("$");
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`);
}

export function parseRobots(text: string, agent: string): RobotsRules {
  const token = agent.toLowerCase();
  const groups: { agents: string[]; rules: Rule[] }[] = [];
  const sitemaps: string[] = [];
  let current: { agents: string[]; rules: Rule[] } | undefined;
  let lastWasAgent = false;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (field === "user-agent") {
      if (!current || !lastWasAgent) groups.push((current = { agents: [], rules: [] }));
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if (field === "allow" || field === "disallow") {
      lastWasAgent = false;
      // An empty Disallow allows everything; it adds no rule.
      if (current && value) current.rules.push({ allow: field === "allow", pattern: value });
    } else if (field === "sitemap") {
      if (value) sitemaps.push(value);
    } else {
      lastWasAgent = false;
    }
  }

  const named = groups.filter((g) => g.agents.some((a) => a !== "*" && token.includes(a)));
  const chosen = named.length ? named : groups.filter((g) => g.agents.includes("*"));
  const rules = chosen.flatMap((g) => g.rules).map((r) => ({ ...r, re: toRegExp(r.pattern) }));

  return {
    sitemaps,
    allows(path) {
      let best: { allow: boolean; length: number } | undefined;
      for (const r of rules) {
        if (!r.re.test(path)) continue;
        const length = r.pattern.length;
        if (!best || length > best.length || (length === best.length && r.allow))
          best = { allow: r.allow, length };
      }
      return best?.allow ?? true;
    },
  };
}
