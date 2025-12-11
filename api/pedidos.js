import { connectToDB } from "./_db";

export default async function handler(req, res) {
  const db = await connectToDB();

  if (req.method === "POST") {
    const pedido = req.body;
    const result = await db.collection("doceeser_pedidos").insertOne(pedido);
    return res.status(200).json({ id: result.insertedId });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
