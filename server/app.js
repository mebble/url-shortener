import express from 'express'
import { MongoClient } from 'mongodb'

export function startDatabase(uri) {
    const client = new MongoClient(uri)

    let db
    try {
        db = client.db()
    } finally {
        process.once('SIGINT', async (_signal) => {
            await client.close()
        })
    }

    return db
}

/**
 * @param {import('mongodb').Db} db
 */
export function startApp(db) {
    const app = express()

    app.use(express.json())

    app.get('/', (req, res) => res.send({ message: 'ping' }))

    return app
}
