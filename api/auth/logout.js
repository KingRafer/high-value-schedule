import { getDb } from "../_lib/db.js";
import { clearAuthCookie, hashToken } from "../_lib/auth.js";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method tidak diizinkan." });
  const raw = req.headers.cookie || "";
  const item = raw.split(";").map(v => v.trim()).find(v => v.startsWith("hvos_token="));
  const token = item ? decodeURIComponent(item.slice("hvos_token=".length)) : "";
  if (token) {
    try { await (await getDb()).collection("sessions").deleteOne({ tokenHash: hashToken(token) }); }
    catch (error) { console.error("logout:", error); }
  }
  clearAuthCookie(res);
  return res.status(200).json({ ok: true });
}