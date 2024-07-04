import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const saltRounds = 10

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = bodySchema.parse(request.body)

    try {
      // Verificar se o usuário com o mesmo e-mail já existe no banco
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (!existingUser) {
        return reply
          .status(404)
          .send({ error: 'Usuario não encontrado no banco' })
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password,
      )

      console.log(passwordMatch)

      if (!passwordMatch) {
        return reply.status(401).send({ error: 'Senha incorreta' })
      }

      const token = app.jwt.sign(
        {
          name: existingUser.name,
        },
        {
          sub: existingUser.id,
          expiresIn: '7 days',
        },
      )

      console.log(token)

      return { token }
    } catch (error) {
      reply
        .status(400)
        .send({ error: 'Erro ao salvar informações no banco, tente novamente' })
    }
  })

  app.post('/register', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    try {
      // Verificar se o usuário com o mesmo e-mail já existe no banco
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return reply
          .status(409)
          .send({ error: 'Usuario ja existente no banco com esta informação' })
      }

      const criptoPass = await bcrypt.hash(password, saltRounds)

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: criptoPass,
        },
      })

      const token = app.jwt.sign(
        {
          name,
        },
        {
          sub: newUser.id,
          expiresIn: '7 days',
        },
      )

      console.log(token)

      return { token }
    } catch (error) {
      reply
        .status(400)
        .send({ error: 'Erro ao salvar informações no banco, tente novamente' })
    }
  })
}
