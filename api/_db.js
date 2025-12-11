import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
let client = null;
export async function connectToDB(){ if (client) return client.db(process.env.MONGO_DBNAME||'Doceeser'); client = new MongoClient(uri); await client.connect(); return client.db(process.env.MONGO_DBNAME||'Doceeser'); }