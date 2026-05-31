export async function ensureOk(res: Response): Promise<void> {
  if (res.ok) return;
  const body = await res.text();
  throw new Error(body.trim() || `Request failed (${res.status})`);
}
