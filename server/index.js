import 'dotenv/config'
import express from 'express'
import { MongoClient } from 'mongodb'

const uri = process.env.DB_URI
const port = Number(process.env.SERVER_PORT)

async function startDatabase() {
    const client = new MongoClient(uri)

    let db
    try {
        db = client.db()
    } finally {
        process.once('SIGTERM', async (_signal) => {
            await client.close()
        })
    }

    return db
}

async function startApp(db) {
    const app = express()
    const movies = db.collection('movies')

    app.use(express.json())

    app.get('/', async (req, res) => {
        const c = await movies.find()
        const m = await c.toArray()
        res.json(m)
    })

    app.post('/movies', async (req, res) => {
        const { title, description } = req.body
        await movies.insertOne({ title, description })
        res.end('DONE')
    })

    app.listen(port, () => {
        console.log('Listening on', port)
    })
}

startDatabase()
    .then(startApp)
    .catch(console.dir)
