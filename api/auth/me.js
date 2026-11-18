import { requireUser } from "../../lib/auth.js";
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method tidak diizinkan." });
  res.setHeader("Cache-Control", "private, no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  const user = await requireUser(req, res);
  if (user) return res.status(200).json({ user });
}