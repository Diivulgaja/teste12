import { connectToDB } from "./_db";
import { ObjectId } from "mongodb";
export default async function handler(req, res){
  try{
    const db = await connectToDB();
    if (req.method === 'GET'){
      const id = req.query?.id;
      if (id){
        const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;
        const o = await db.collection('doceeser_pedidos').findOne({_id: objectId});
        return res.status(200).json(o || null);
      }
      const list = await db.collection('doceeser_pedidos').find().sort({createdAt:-1}).toArray();
      return res.status(200).json(list);
    }
    if (req.method === 'POST'){
      const body = req.body;
      body.createdAt = body.createdAt || new Date().toISOString();
      const r = await db.collection('doceeser_pedidos').insertOne(body);
      return res.status(201).json({ id: r.insertedId.toString() });
    }
    return res.status(405).json({ error: 'method' });
  }catch(e){ console.error(e); return res.status(500).json({ error: e.message }); }
}