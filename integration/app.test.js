import 'dotenv/config'
import { expect, test } from 'vitest'
import request from 'supertest'

import { startDatabase, startApp } from '../server/app.js'

const uri = process.env.DB_URI

const db = startDatabase(uri)
const app = startApp(db)

test('ping', async () => {
    const res = await request(app).get('/')
    expect(res.body).toEqual({ message: 'ping' })
})
