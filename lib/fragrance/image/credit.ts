/** The credit link for an official picture: only https pages, labelled by their host. */
export function imageCredit(source: string | undefined): { href: string; label: string } | undefined {
  if (!source) return undefined;
  try {
    const url = new URL(source);
    return url.protocol === "https:"
      ? { href: url.toString(), label: url.hostname.replace(/^www\./, "") }
      : undefined;
  } catch {
    return undefined;
  }
}
