import { parseMovie } from './parse.js'

export default class MovieController {
    /**
    * @param {import('mongodb').Collection} movieCollection
    */
    constructor(movieCollection) {
        this.movieCollection = movieCollection
    }

    /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    */
    async getMovies(_req, res) {
        const cursor = this.movieCollection.find()
        const movies = await cursor.toArray()
        res.json(movies)
    }

    /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    */
    async postMovie(req, res) {
        const parseRes = parseMovie(req.body)
        if (!parseRes.success) {
            errResponse(parseRes.error, res)
            return
        }

        const movie = parseRes.data
        const result = await this.movieCollection.insertOne(movie)
        res.json({
            ...movie,
            id: result.insertedId
        })
    }
}

const mapping = {
    'invalid_type': 400,
}

/**
 * @param {import('zod').ZodError} err
 * @param {import('express').Response} res
 */
function errResponse(err, res) {
    const error = err.errors[0]
    res.statusCode = mapping[error.code] || 400;
    res.json(error)
}
