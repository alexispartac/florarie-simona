import { MongoClient } from 'mongodb';

// const uri: string | undefined = process.env.MONGODB_URI || "mongodb+srv://alexis-matei-13:Lucaaliuta13@cluster0.stmiw0l.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0"
const uri: string | undefined = process.env.MONGODB_URI || "mongodb://localhost:27017/"
const options: object = {};

if (!uri) {
  throw new Error('⚠️ MONGODB_URI nu este setată în .env.local');
}

const client: MongoClient = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> = client.connect();


export default clientPromise;