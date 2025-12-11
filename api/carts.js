
import { MongoClient } from "mongodb";

let cached = null;
async function connect() {
  if (cached) return cached;
  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  cached = client;
  return client;
}

export default async function handler(req, res) {
  try {
    const client = await connect();
    const db = client.db(process.env.MONGO_DBNAME || 'painelmobile');
    if (req.method === 'GET') {
      const userId = req.query && req.query.userId;
      if (!userId) return res.status(400).json({ items: [] });
      const doc = await db.collection('carts').findOne({ userId });
      return res.status(200).json(doc || { items: [] });
    }
    if (req.method === 'POST') {
      const { userId, items } = req.body;
      if (!userId) return res.status(400).json({ error: 'no userId' });
      await db.collection('carts').updateOne({ userId }, { $set: { items, updatedAt: new Date().toISOString() } }, { upsert: true });
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'method' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
