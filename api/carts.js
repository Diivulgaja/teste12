import { connectToDB } from "./_db";

export default async function handler(req, res) {
  const db = await connectToDB();

  if (req.method === "GET") {
    const { userId } = req.query;
    const cart = await db.collection("carts").findOne({ userId });
    return res.status(200).json(cart || { items: [] });
  }

  if (req.method === "POST") {
    const { userId, items } = req.body;
    await db.collection("carts").updateOne(
      { userId },
      { $set: { items } },
      { upsert: true }
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
