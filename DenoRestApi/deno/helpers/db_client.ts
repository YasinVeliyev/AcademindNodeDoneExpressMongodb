import { Database, MongoClient } from "https://deno.land/x/mongo@v0.28.0/mod.ts";

let db: Database;

export async function connect() {
    const client = new MongoClient();
    await client.connect("mongodb://localhost:27017");
    db = client.database("deno_todo_app");
}

export function getDb() {
    return db;
}
