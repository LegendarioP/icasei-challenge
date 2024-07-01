import { FastifyInstance } from 'fastify'
import { getYouTubeData } from './youtubeService'
// import { z } from 'zod'

export async function HomeVids(app: FastifyInstance) {
  const APIKEY = process.env.YOUTUBE_API_KEY
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
      console.log(data)
      return data
    } catch (error) {
      app.log.error(error)
      return { error: 'Erro ao buscar dados do YouTube' }
    }
  })
}
