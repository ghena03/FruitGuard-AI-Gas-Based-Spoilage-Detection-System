import Constants from "expo-constants";

const BASE_URL =
  (Constants?.expoConfig?.extra as any)?.apiBase ??
  "https://fresh-detect-app.onrender.com";

export type PredictResponse = {
  label: string;
  confidence: number;
  raw?: any;
};

export interface GasBody {
  vrl?: number;
  adc?: number;
  adc_max?: number;
  vref?: number;
  rl?: number;
  rs?: number;
  r0?: number;
}

async function fetchJson(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

export async function getSummary() {
  return fetchJson(`${BASE_URL}/summary`, { cache: "no-store" });
}

export async function sendGasReading(body: GasBody) {
  return fetchJson(`${BASE_URL}/gas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function predictFruit(asset: { uri: string }) {
  const form = new FormData();
  const ext = asset.uri.split(".").pop()?.toLowerCase() || "jpg";
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
  form.append("image", { uri: asset.uri, name: `photo.${ext}`, type: mime } as any);

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(`${BASE_URL}/predict`, { method: "POST", body: form, signal: controller.signal });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  } finally {
    clearTimeout(id);
  }
}

/* ---- Push notifications API ---- */
export async function registerExpoToken(token: string) {
  return fetchJson(`${BASE_URL}/register_expo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

export async function unregisterExpoToken(token: string) {
  return fetchJson(`${BASE_URL}/unregister_expo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}
