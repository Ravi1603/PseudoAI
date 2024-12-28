import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

let clientPromise;

if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function GET(request, { params }) {
    const id = await params.id;
    try {
        const client = await clientPromise;
        const db = client.db(dbName);
        const collection = db.collection('Problems');

        const problem = await collection.findOne({ id: params.id });

        if (!problem) {
            return new Response(
                JSON.stringify({ error: 'Problem not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        return new Response(JSON.stringify(problem), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in GET:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
