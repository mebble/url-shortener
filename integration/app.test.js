import 'dotenv/config'
import { expect, describe, test, beforeEach } from 'vitest'
import request from 'supertest'

import { startDatabase, startApp } from '../server/app.js'

const uri = process.env.DB_URI

const db = startDatabase(uri)
const app = startApp(db)

beforeEach(async () => {
    const movies = db.collection('movies')
    await movies.drop()
    await movies.insertMany([
        { _id: '1', title: 'movie 1', description: 'this is movie 1' },
        { _id: '2', title: 'movie 2', description: 'this is movie 2' },
    ])
})

describe('post movie', () => {
    test('happy path', async () => {
        const movie = { title: 'movie x', description: 'this is movie x' }
        const res = await request(app).post('/movies').send(movie)
        const { id, ...fields } = res.body
        expect(id).toBeTypeOf('string')
        expect(fields).toEqual(movie)
    })

    test('invalid req body', async () => {
        const movie = { title: 'movie x' }
        const res = await request(app).post('/movies').send(movie)
        expect(res.body).toEqual({
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['description'],
            message: 'Required'
        })
    })
})

test('get movies', async () => {
    const res = await request(app).get('/')
    expect(res.body).toEqual([
        {
            "id": "1",
            "title": "movie 1",
            "description": "this is movie 1",
        },
        {
            "id": "2",
            "title": "movie 2",
            "description": "this is movie 2",
        },
    ])
})
