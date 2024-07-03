import { FastifyInstance } from 'fastify'
// import { getYouTubeData } from './youtubeService'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
import { getYouTubeData } from './youtubeService'

export async function favoriteVids(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })
  app.get('/favorites', async (request) => {
    const favorites = await prisma.favorites.findMany({
      where: {
        userId: request.user.sub,
      },
    })

    return favorites
  })

  app.get('/favoritedVideos', async (request) => {
    const APIKEY = process.env.YOUTUBE_API_KEY
    const favorited = await prisma.favorites.findMany({
      where: {
        userId: request.user.sub,
      },
    })

    const favoritedVideos = favorited
      .map((item) => {
        return item.youtube_idVid
      })
      .join(',')

    try {
      const data = await getYouTubeData(
        'videos',
        {
          part: 'snippet',
          maxResults: '16',
          regionCode: 'BR',
          id: favoritedVideos,
        },
        APIKEY,
      )
      return data
    } catch (error) {
      return { error: 'Erro ao buscar dados do YouTube' }
    }
  })

  app.post('/favorites', async (request) => {
    const bodySchema = z.object({
      youtube_idVid: z.string(),
    })

    const { youtube_idVid } = bodySchema.parse(request.body)

    const favorited = await prisma.favorites.create({
      data: {
        youtube_idVid,
        userId: request.user.sub,
      },
    })

    return favorited
  })

  app.delete('/favorites/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const favorite = await prisma.favorites.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (favorite.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.favorites.delete({
      where: {
        id,
      },
    })
  })
}
