import fastify from 'fastify'
import cors from '@fastify/cors'
import { HomeVids } from './routes/home'
import dotenv from 'dotenv'
import { Search } from './routes/search'

dotenv.config()

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(HomeVids)
app.register(Search)

app.setErrorHandler((error, request, reply) => {
  console.error(error)
  reply.status(500).send({ error: 'Internal Server Error' })
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP RUNNING ON http://localhost:3333')
})
