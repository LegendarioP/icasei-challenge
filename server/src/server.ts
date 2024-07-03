import fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import jwt from '@fastify/jwt'
import { homeVids } from './routes/home'
import { search } from './routes/search'
import { authRoutes } from './routes/auth'
import { favoriteVids } from './routes/favorite'

dotenv.config()

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: 'akdgaskodgaskhdgajsdghjkqsgdayjo',
})

app.register(homeVids)
app.register(search)
app.register(authRoutes)
app.register(favoriteVids)

app.setErrorHandler((error, request, reply) => {
  console.error(error)
  reply.status(500).send({ error: 'Internal Server Error' })
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP RUNNING ON http://localhost:3333')
})
