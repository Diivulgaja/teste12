import { connectToDB } from "./_db";
export default async function handler(req, res){
  try{
    const db = await connectToDB();
    if (req.method === 'GET'){
      const userId = req.query?.userId;
      if (!userId) return res.status(400).json({items:[]});
      const doc = await db.collection('carts').findOne({ userId });
      return res.status(200).json(doc || { items: [] });
    }
    if (req.method === 'POST'){
      const { userId, items } = req.body;
      if (!userId) return res.status(400).json({ error: 'no userId' });
      await db.collection('carts').updateOne({ userId }, { $set: { items, updatedAt: new Date().toISOString() } }, { upsert: true });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'method' });
  }catch(e){ console.error(e); return res.status(500).json({ error: e.message }); }
}