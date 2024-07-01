import { FastifyInstance } from 'fastify'
import { getYouTubeData } from './youtubeService'
import { z } from 'zod'

export async function Search(app: FastifyInstance) {
  const APIKEY = process.env.YOUTUBE_API_KEY

  app.post('/search', async (request) => {
    const bodySchema = z.object({
      searchParams: z.string(),
    })
    const { searchParams } = bodySchema.parse(request.body)

    try {
      const data = await getYouTubeData(
        'search',
        {
          part: 'snippet',
          q: searchParams,
          maxResults: '16',
          regionCode: 'BR',
          type: 'video',
          relevanceLanguage: 'pt-br',
        },
        APIKEY,
      )
      console.log(data)
      return data
    } catch (error) {
      app.log.error(error)
      return { error: 'Erro ao buscar dados do YouTube' }
    }
  })
}
