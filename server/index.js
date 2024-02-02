import 'dotenv/config'
import { startDatabase, startApp } from './app.js'

const uri = process.env.DB_URI
const port = Number(process.env.SERVER_PORT)

const db = startDatabase(uri)
const app = startApp(db)

app.listen(port, () => {
    console.log('Listening on', port)
})
