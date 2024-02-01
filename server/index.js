import 'dotenv/config'
import express from 'express'
import { MongoClient } from 'mongodb'
import { parseMovie } from './movies/parse.js'
import { errResponse } from './movies/controller.js'

const uri = process.env.DB_URI
const port = Number(process.env.SERVER_PORT)

async function startDatabase() {
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
async function startApp(db) {
    const app = express()
    const movies = db.collection('movies')

    app.use(express.json())

    app.get('/', async (_req, res) => {
        const c = movies.find()
        const m = await c.toArray()
        res.json(m)
    })

    app.post('/movies', async (req, res) => {
        const parseRes = parseMovie(req.body)
        if (!parseRes.success) {
            errResponse(parseRes.error, res)
            return
        }

        const movie = parseRes.data
        const result = await movies.insertOne(movie)
        res.json({
            ...movie,
            id: result.insertedId
        })
    })

    app.listen(port, () => {
        console.log('Listening on', port)
    })
}

startDatabase()
    .then(startApp)
    .catch(console.dir)
