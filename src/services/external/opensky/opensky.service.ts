/* eslint-disable no-useless-catch */
import axios from 'axios'
import { type IOpenSkyResponse } from './opensky.types'

class OpenSkyService {
	private apiUrl: string

	constructor() {
		//  URL вашего Express-бэкенда (прокси), а не прямого API OpenSky
		this.apiUrl = 'http://localhost:5174/api'
	}

	async fetchLiveFlights() {
		try {
			//  Путь '/flights/live' совпадает с роутом в backend/index.ts
			const response = await axios.get<IOpenSkyResponse>(
				`${this.apiUrl}/flights/live`
				//  Заголовок Authorization НЕ нужен здесь — токен используется на бэкенде
			)

			// OpenSky возвращает массив состояний в поле 'states'
			if (!Array.isArray(response.data.states)) {
				console.warn('Unexpected API response structure:', response.data)
				return response.data
			}

			return response.data
		} catch (err) {
			console.error(' Failed to fetch live flights:', err)
			throw err
		}
	}
}

export default new OpenSkyService()