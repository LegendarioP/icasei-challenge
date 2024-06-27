import fastify from 'fastify'
import cors from '@fastify/cors'


const app = fastify()


app.register(cors, {
    origin: true,
  })


app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP RUNNING ON http://localhost:3333')
  })
