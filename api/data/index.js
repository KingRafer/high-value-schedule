import { getDb } from "../../lib/db.js";
import { requireUser } from "../../lib/auth.js";

const allowedKey = key => typeof key === "string" && /^hvos_[a-zA-Z0-9_-]{1,100}$/.test(key);
const MAX_ITEM_BYTES = 512 * 1024;
const MAX_BATCH_BYTES = 2 * 1024 * 1024;

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
      if (size > MAX_ITEM_BYTES) return res.status(413).json({ error: "Ukuran satu item maksimal 512 KB." });
      await collection.updateOne(
        { userId: user.id, key },
        { $set: { value, updatedAt: new Date() }, $setOnInsert: { userId: user.id, key, createdAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }
    if (req.method === "POST") {
      const items = req.body?.items;
      if (!Array.isArray(items) || items.length < 1 || items.length > 100) {
        return res.status(400).json({ error: "Batch harus berisi 1–100 perubahan." });
      }
      const totalBytes = Buffer.byteLength(JSON.stringify(items), "utf8");
      if (totalBytes > MAX_BATCH_BYTES) return res.status(413).json({ error: "Ukuran batch maksimal 2 MB." });
      const now = new Date();
      const operations = [];
      for (const item of items) {
        if (!allowedKey(item?.key) || !["PUT", "DELETE"].includes(item?.method)) {
          return res.status(400).json({ error: "Perubahan batch tidak valid." });
        }
        if (item.method === "DELETE") {
          operations.push({ deleteOne: { filter: { userId: user.id, key: item.key } } });
        } else {
          const size = Buffer.byteLength(JSON.stringify(item.value ?? null), "utf8");
          if (size > MAX_ITEM_BYTES) return res.status(413).json({ error: "Ukuran satu item maksimal 512 KB." });
          operations.push({
            updateOne: {
              filter: { userId: user.id, key: item.key },
              update: { $set: { value: item.value, updatedAt: now }, $setOnInsert: { userId: user.id, key: item.key, createdAt: now } },
              upsert: true
            }
          });
        }
      }
      if (operations.length) await collection.bulkWrite(operations, { ordered: false });
      return res.status(200).json({ ok: true, count: operations.length });
    }
    if (req.method === "DELETE") {
      const key = req.body?.key;
      if (!allowedKey(key)) return res.status(400).json({ error: "Key data tidak valid." });
      await collection.deleteOne({ userId: user.id, key });
      return res.status(200).json({ ok: true });
    }
    res.setHeader("Allow", "GET, PUT, POST, DELETE");
    return res.status(405).json({ error: "Method tidak diizinkan." });
  } catch (error) {
    console.error("data:", error);
    return res.status(500).json({ error: "Gagal menyimpan data." });
  }
}