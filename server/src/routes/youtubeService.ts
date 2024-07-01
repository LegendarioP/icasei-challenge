import axios from 'axios'
import NodeCache from 'node-cache'

const API_URL = 'https://www.googleapis.com/youtube/v3/'
const cache = new NodeCache({ stdTTL: 600 }) // Cache de 10 minutos

export const getYouTubeData = async (
  endpoint: string,
  params: object,
  apiKey: string,
) => {
  const cacheKey = `${endpoint}-${JSON.stringify(params)}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    return cachedData
  }

  try {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      params: { ...params, key: apiKey },
    })
    cache.set(cacheKey, response.data)
    return response.data
  } catch (error) {
    console.error('Erro ao chamar a API do YouTube:', error)
    throw error
  }
}
