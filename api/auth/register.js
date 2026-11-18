import bcrypt from "bcryptjs";
import { getDb } from "../../lib/db.js";
import { createSession } from "../../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method tidak diizinkan." });
  try {
    const name = String(req.body?.name || "").trim().slice(0, 80);
    const email = String(req.body?.email || "").trim().toLowerCase().slice(0, 160);
    const password = String(req.body?.password || "");
    if (name.length < 2) return res.status(400).json({ error: "Nama minimal 2 karakter." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Email tidak valid." });
    if (password.length < 10) return res.status(400).json({ error: "Password minimal 10 karakter." });
    const db = await getDb();
    const users = db.collection("users");
    if (await users.findOne({ email })) return res.status(409).json({ error: "Email sudah terdaftar." });
    const user = { name, email, passwordHash: await bcrypt.hash(password, 12), createdAt: new Date(), updatedAt: new Date() };
    const result = await users.insertOne(user);
    user._id = result.insertedId;
    await createSession(db, user, res);
    await db.collection("user_settings").updateOne(
      { userId: user._id.toString() },
      { $setOnInsert: { userId: user._id.toString(), createdAt: new Date(), updatedAt: new Date(), preferences: {} } },
      { upsert: true }
    );
    return res.status(201).json({ user: { id: user._id.toString(), name, email } });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ error: "Email sudah terdaftar." });
    console.error("register:", error);
    return res.status(500).json({ error: "Registrasi gagal. Periksa konfigurasi server." });
  }
}