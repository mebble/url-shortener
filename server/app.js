import express from 'express'
import { MongoClient } from 'mongodb'
import MovieController from './movies/controller.js'

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
    const movies = db.collection('movies')

    app.use(express.json())

    const movieController = new MovieController(movies)

    app.get('/', (req, res) => movieController.getMovies(req, res))
    app.post('/movies', (req, res) => movieController.postMovie(req, res))

    return app
}
