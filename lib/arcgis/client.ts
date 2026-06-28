const DEFAULT_TIMEOUT_MS = 5000;

export async function fetchArcGIS<T>(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "LandOS/1.0 (thelonestarcapitalpartners@gmail.com)",
      },
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const data = (await res.json()) as T;
    return data;
  } catch {
    clearTimeout(timer);
    return null;
  }
}
