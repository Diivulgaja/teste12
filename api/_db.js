import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
export async function connectToDB() {
  if (!client) client = new MongoClient(uri);
  await client.connect();
  return client.db("Doceeser");
}
