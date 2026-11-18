import bcrypt from "bcryptjs";
import { getDb } from "../../lib/db.js";
import { createSession } from "../../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method tidak diizinkan." });
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const db = await getDb();
    const user = await db.collection("users").findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Email atau password salah." });
    }
    await createSession(db, user, res);
    return res.status(200).json({ user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (error) {
    console.error("login:", error);
    return res.status(500).json({ error: "Login gagal. Periksa konfigurasi server." });
  }
}