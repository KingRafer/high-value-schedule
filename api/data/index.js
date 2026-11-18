import { getDb } from "../_lib/db.js";
import { requireUser } from "../_lib/auth.js";

const allowedKey = key => typeof key === "string" && /^hvos_[a-zA-Z0-9_-]{1,100}$/.test(key);
export default async function handler(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;
  try {
    const collection = (await getDb()).collection("user_data");
    if (req.method === "GET") {
      const docs = await collection.find({ userId: user.id }, { projection: { _id: 0, key: 1, value: 1 } }).toArray();
      const data = Object.fromEntries(docs.map(doc => [doc.key, doc.value]));
      return res.status(200).json({ data });
    }
    if (req.method === "PUT") {
      const key = req.body?.key;
      if (!allowedKey(key)) return res.status(400).json({ error: "Key data tidak valid." });
      const value = req.body?.value;
      const size = Buffer.byteLength(JSON.stringify(value ?? null), "utf8");
      if (size > 512 * 1024) return res.status(413).json({ error: "Ukuran satu item maksimal 512 KB." });
      await collection.updateOne(
        { userId: user.id, key },
        { $set: { value, updatedAt: new Date() }, $setOnInsert: { userId: user.id, key, createdAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }
    if (req.method === "DELETE") {
      const key = req.body?.key;
      if (!allowedKey(key)) return res.status(400).json({ error: "Key data tidak valid." });
      await collection.deleteOne({ userId: user.id, key });
      return res.status(200).json({ ok: true });
    }
    res.setHeader("Allow", "GET, PUT, DELETE");
    return res.status(405).json({ error: "Method tidak diizinkan." });
  } catch (error) {
    console.error("data:", error);
    return res.status(500).json({ error: "Gagal menyimpan data." });
  }
}