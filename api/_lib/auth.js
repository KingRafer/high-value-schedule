import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { getDb } from "./db.js";

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
export function setAuthCookie(res, token, maxAge) {
  const parts = [
    "hvos_token=" + token,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=" + maxAge
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}
export function clearAuthCookie(res) {
  const parts = ["hvos_token=", "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}
function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  const item = raw.split(";").map(v => v.trim()).find(v => v.startsWith(name + "="));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : "";
}
export async function requireUser(req, res) {
  const token = readCookie(req, "hvos_token");
  if (!token || !process.env.JWT_SECRET) {
    res.status(401).json({ error: "Silakan login terlebih dahulu." });
    return null;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDb();
    const session = await db.collection("sessions").findOne({
      _id: payload.sid,
      userId: payload.sub,
      tokenHash: hashToken(token),
      expiresAt: { $gt: new Date() }
    });
    if (!session) throw new Error("Session tidak aktif");
    const user = await db.collection("users").findOne(
      { _id: (await import("mongodb")).ObjectId.createFromHexString(payload.sub) },
      { projection: { passwordHash: 0 } }
    );
    if (!user) throw new Error("User tidak ditemukan");
    return { id: user._id.toString(), name: user.name, email: user.email };
  } catch {
    clearAuthCookie(res);
    res.status(401).json({ error: "Sesi berakhir. Silakan login kembali." });
    return null;
  }
}
export async function createSession(db, user, res) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET wajib minimal 32 karakter.");
  }
  const sid = crypto.randomUUID();
  const maxAge = 60 * 60 * 24 * 14;
  const token = jwt.sign({ sub: user._id.toString(), sid }, process.env.JWT_SECRET, { expiresIn: maxAge });
  const expiresAt = new Date(Date.now() + maxAge * 1000);
  await db.collection("sessions").insertOne({
    _id: sid,
    userId: user._id.toString(),
    tokenHash: hashToken(token),
    createdAt: new Date(),
    expiresAt
  });
  setAuthCookie(res, token, maxAge);
}