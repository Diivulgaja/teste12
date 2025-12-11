
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
      const id = req.query && req.query.id;
      if (id) {
        const o = await db.collection('pedidos').findOne({_id: typeof id === 'string' && id.length===24 ? new require('mongodb').ObjectId(id) : id});
        return res.status(200).json(o || null);
      }
      const list = await db.collection('pedidos').find().sort({createdAt:-1}).toArray();
      return res.status(200).json(list);
    }
    if (req.method === 'POST') {
      const body = req.body;
      body.createdAt = body.createdAt || new Date().toISOString();
      const r = await db.collection('pedidos').insertOne(body);
      return res.status(201).json({ id: r.insertedId.toString() });
    }
    res.status(405).json({ error: 'method' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
