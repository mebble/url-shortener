import express from 'express'
import { MongoClient } from 'mongodb'
import { generateID } from './id.js'

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
    const urls = db.collection('urls')

    app.use(express.json())

    app.get('/', (req, res) => res.send({ message: 'ping' }))

    app.post('/url', async (req, res) => {
        const { url } = req.body;
        const short = generateID()
        const insertRes = await urls.insertOne({ original: url, short: short })
        res.json({ short: short })
    })

    app.get('/:shortId', async (req, res) => {
        const { shortId } = req.params
        const query = { short: shortId }

        const out = await urls.findOne(query)
        if (out === null) {
            res.status(404)
            res.end()
            return
        }
        
        res.redirect(out.original)
    })

    return app
}
