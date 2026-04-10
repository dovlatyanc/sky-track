import axios from 'axios'
import dotenv from 'dotenv'

import { SimpleCache } from '../../utils/cache.util'

import type { IFetchFlightsResponse } from './aviation.types'

dotenv.config()

class AviationService {
	private apiUrl: string
	private token: string
	private cache = new SimpleCache<IFetchFlightsResponse>(60_000) // TTL 1 min.

	constructor() {
		this.apiUrl = 'https://api.aviationstack.com/v1'
		this.token = process.env.AVIATIONSTACK_API_TOKEN!
	}

	private get getFlightsUrl() {
		const url = new URL(`${this.apiUrl}/flights`)
		url.searchParams.append('access_key', this.token)
		return url
	}

	async fetchLiveFlights(limit = 10) {
		const cacheKey = `flights_${limit}`

		// 1. Проверяем кэш
		const cached = this.cache.get(cacheKey)
		if (cached) {
			console.log('Returning cached flights')
			return cached
		}

		const url = this.getFlightsUrl
		url.searchParams.set('limit', limit.toString())
		url.searchParams.set('flight_status', 'active')

		try {
			console.log('Fetching flights from AviationStack API')
			const response = await axios.get<IFetchFlightsResponse>(url.toString())

			if (response.status !== 200) {
				throw new Error(`Error fetching flights: ${response.statusText}`)
			}

			console.log('Flights successfully fetched from AviationStack API')

			// 3. Сохраняем в кэш
			this.cache.set(cacheKey, response.data)

			return response.data
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const status = err.response?.status
				const message = err.response?.data?.error?.info || err.message
				throw new Error(`AviationStack API error [${status}]: ${message}`)
			}

			throw new Error(`Unexpected AviationService error: ${String(err)}`)
		}
	}
}

export default new AviationService()
