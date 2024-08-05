import { MongoClient, Db } from 'mongodb';

const CONNECTION_STRING="mongodb+srv://ruturajgole813:3wJwiHhRY94VWFTW@taskmanagement.ktqj5te.mongodb.net/?retryWrites=true&w=majority&appName=taskManagement";

const url = `${CONNECTION_STRING}`; // Replace with your connection string
const client = new MongoClient(url);
let db: Db;

export async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('task_management'); // Replace with your database name
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}
