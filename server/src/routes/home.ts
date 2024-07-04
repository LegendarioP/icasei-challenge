import { FastifyInstance } from 'fastify'
import { getYouTubeData } from './youtubeService'
import { z } from 'zod'

export async function homeVids(app: FastifyInstance) {
  const APIKEY = process.env.YOUTUBE_API_KEY
  if (!APIKEY) {
    throw new Error(
      'YOUTUBE_API_KEY não está definido nas variáveis de ambiente',
    )
  }
  app.get('/home', async () => {
    try {
      const data = await getYouTubeData(
        'videos',
        {
          part: 'snippet',
          chart: 'mostPopular',
          maxResults: '16',
          regionCode: 'BR',
        },
        APIKEY,
      )
      // console.log(data)
      return data
    } catch (error) {
      // app.log.error(error)
      return { error: 'Erro ao buscar dados do YouTube' }
    }
  })
  app.post('/loadvideos', async (request) => {
    const bodySchema = z.object({
      pageToken: z.string(),
    })

    const { pageToken } = bodySchema.parse(request.body)

    try {
      const data = await getYouTubeData(
        'videos',
        {
          part: 'snippet',
          chart: 'mostPopular',
          maxResults: '16',
          regionCode: 'BR',
          pageToken,
        },
        APIKEY,
      )
      // console.log(data)
      return data
    } catch (error) {
      // app.log.error(error)
      return { error: 'Erro ao buscar dados do YouTube' }
    }
  })
}
