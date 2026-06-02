const { MongoClient } = require('mongodb');

const mongoUrl = process.env.MONGO_URL;
let db;
let client;

async function connectMongoDB() {
    try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        db = client.db('carusi_bot');
        
        await db.createCollection('famiglie').catch(() => {});
        await db.createCollection('history').catch(() => {});
        await db.createCollection('config').catch(() => {});
        await db.createCollection('reactroles').catch(() => {});
        
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

function getDB() {
    return db;
}

module.exports = { connectMongoDB, getDB };
