import { MongoClient } from 'mongodb';

const uri: string | undefined = process.env.MONGODB_URI;
const options: object = {};

if (!uri) {
  throw new Error('⚠️ MONGODB_URI nu este setată în .env.local');
}

const client: MongoClient = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> = client.connect();


export default clientPromise;