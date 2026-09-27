function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, " ");
}

export function readingMinutes(body: string) {
  const words = stripTags(body).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function excerpt(body: string, length = 160) {
  const flat = stripTags(body).replace(/\s+/g, " ").trim();
  return flat.length > length ? `${flat.slice(0, length).trimEnd()}…` : flat;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}
