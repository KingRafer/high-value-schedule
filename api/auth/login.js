import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { getDb } from "../../lib/db.js";
import { createSession } from "../../lib/auth.js";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function rateLimitId(email, req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = String(req.headers["x-real-ip"] || forwarded || "unknown").slice(0, 80);
  return crypto.createHash("sha256").update(ip + "|" + email).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method tidak diizinkan." });
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || password.length > 200) {
      return res.status(400).json({ error: "Email atau password tidak valid." });
    }

    const db = await getDb();
    const limits = db.collection("auth_rate_limits");
    const id = rateLimitId(email, req);
    const now = new Date();
    const cutoff = new Date(now.getTime() - WINDOW_MS);
    await limits.updateOne(
      { _id: id },
      [{
        $set: {
          windowStartedAt: {
            $cond: [{ $gt: ["$windowStartedAt", cutoff] }, "$windowStartedAt", now]
          },
          attempts: {
            $cond: [
              { $gt: ["$windowStartedAt", cutoff] },
              { $add: [{ $ifNull: ["$attempts", 0] }, 1] },
              1
            ]
          },
          expiresAt: new Date(now.getTime() + 60 * 60 * 1000)
        }
      }],
      { upsert: true }
    );
    const limit = await limits.findOne({ _id: id });
    if ((limit?.attempts || 0) > MAX_ATTEMPTS) {
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil((new Date(limit.windowStartedAt).getTime() + WINDOW_MS - now.getTime()) / 1000))));
      return res.status(429).json({ error: "Terlalu banyak percobaan login. Coba lagi setelah 15 menit." });
    }

    const user = await db.collection("users").findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Email atau password salah." });
    }
    await limits.deleteOne({ _id: id });
    await createSession(db, user, res);
    return res.status(200).json({ user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (error) {
    console.error("login:", error);
    return res.status(500).json({ error: "Login gagal. Periksa konfigurasi server." });
  }
}