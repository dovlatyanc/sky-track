// opensky.service.ts
import axios from 'axios'
import { ACCESS_TOKEN } from './opensky.token'
import { type IOpenSkyResponse } from './opensky.types'

class OpenSkyService {
  //  Меняем baseURL на прокси-путь
  private apiUrl: string = '/opensky-api' 

  async fetchLiveFlights() {
    try {
      const response = await axios.get<IOpenSkyResponse>(
        `${this.apiUrl}/states/all`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
          },
          timeout: 10000
        }
      )

      if (!response.data?.states) {
        throw new Error('OpenSky API returned invalid response')
      }

      return response.data
    } catch (err: any) {
   
      if (err.response?.status === 401) {
        console.warn('Токен истёк. Перегенерируйте в opensky.token.ts')
   
      }
      throw err
    }
  }
}

export default new OpenSkyService()