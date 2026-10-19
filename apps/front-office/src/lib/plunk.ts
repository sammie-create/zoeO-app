const PLUNK_API_BASE = "https://next-api.useplunk.com";

function requireApiKey() {
  const key = process.env.PLUNK_API_KEY;
  if (!key) throw new Error("PLUNK_API_KEY is not set");
  return key;
}

export async function sendPlunkEmail(input: { to: string; from: string; subject: string; body: string; reply?: string }) {
  const res = await fetch(`${PLUNK_API_BASE}/v1/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Plunk send failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function upsertPlunkContact(input: { email: string; subscribed?: boolean; data?: Record<string, unknown> }) {
  const res = await fetch(`${PLUNK_API_BASE}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Plunk contact upsert failed: ${res.status} ${await res.text()}`);
  return res.json();
}
