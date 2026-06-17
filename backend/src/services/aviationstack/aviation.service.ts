import axios from 'axios'
import dotenv from 'dotenv'

import { SimpleCache } from '../../utils/cache.util'

import type {
	IFetchAirlinesResponse,
	IFetchCountriesResponse,
	IFetchFlightsResponse
} from './aviation.types'

dotenv.config()

class AviationService {
	private apiUrl: string
	private token: string
	private flightsCache = new SimpleCache<IFetchFlightsResponse>(120_000) // TTL 2 min.
	private countriesCache = new SimpleCache<IFetchCountriesResponse>(600_000) // TTL 10 min.
	private airlinesCache = new SimpleCache<IFetchAirlinesResponse>(600_000) // TTL 10 min.

	constructor() {
		this.apiUrl = 'https://api.aviationstack.com/v1'
		this.token = process.env.AVIATIONSTACK_API_TOKEN || ''
		
		if (!this.token) {
			console.error('❌ AVIATIONSTACK_API_TOKEN is missing in .env file! Using mock data mode.')
		} else {
			console.log('✅ AviationStack API token loaded successfully. Token starts with:', this.token.substring(0, 10) + '...')
		}
	}

	private getUrl(path: string) {
		const url = new URL(`${this.apiUrl}/${path}`)
		url.searchParams.append('access_key', this.token)
		return url
	}

	async fetchLiveFlights(limit = 10, offset = 0, airlineName?: string) {
		const cacheKey = `flights_${limit}_${offset}_${airlineName || 'all'}`

		// 1. Проверяем кэш
		const cached = this.flightsCache.get(cacheKey)
		if (cached) {
			console.log('Returning cached flights')
			return cached
		}

		// 2. Проверяем наличие токена
		if (!this.token) {
			console.warn('⚠️ No API token, returning empty data')
			return {
				data: [],
				pagination: { total: 0, offset: 0, limit: limit, count: 0 }
			}
		}

		const url = this.getUrl('flights')
		url.searchParams.set('limit', limit.toString())
		url.searchParams.set('offset', offset.toString())
		url.searchParams.set('flight_status', 'active')

		if (airlineName) {
			url.searchParams.set('airline_name', airlineName)
		}

		try {
			console.log('Fetching flights from AviationStack API...')
			const response = await axios.get<IFetchFlightsResponse>(url.toString())

			if (response.status !== 200) {
				throw new Error(`Error fetching flights: ${response.statusText}`)
			}

			console.log(`✅ Flights successfully fetched from AviationStack API. Count: ${response.data.data?.length || 0}`)

			// 3. Сохраняем в кэш
			this.flightsCache.set(cacheKey, response.data)

			return response.data
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const status = err.response?.status
				const message = err.response?.data?.error?.info || err.message
				console.error(`❌ AviationStack API error [${status}]: ${message}`)
				throw new Error(`AviationStack API error [${status}]: ${message}`)
			}

			throw new Error(`Unexpected AviationService error: ${String(err)}`)
		}
	}

	async fetchCountries() {
		const cacheKey = 'countries'

		// 1. Проверяем кэш
		const cached = this.countriesCache.get(cacheKey)
		if (cached) {
			console.log('Returning cached countries')
			return cached
		}

		// 2. Проверяем наличие токена
		if (!this.token) {
			console.warn('⚠️ No API token, returning empty countries')
			return {
				data: [],
				pagination: { total: 0, offset: 0, limit: 100, count: 0 }
			}
		}

		try {
			console.log('Fetching countries from AviationStack API...')
			const url = this.getUrl('countries')
			const response = await axios.get<IFetchCountriesResponse>(url.toString())

			if (response.status !== 200) {
				throw new Error(`Error fetching countries: ${response.statusText}`)
			}

			console.log(`✅ Countries successfully fetched from AviationStack API. Count: ${response.data.data?.length || 0}`)

			// 3. Сохраняем в кэш
			this.countriesCache.set(cacheKey, response.data)

			return response.data
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const status = err.response?.status
				const message = err.response?.data?.error?.info || err.message
				console.error(`❌ AviationStack API error [${status}]: ${message}`)
				throw new Error(`AviationStack API error [${status}]: ${message}`)
			}

			throw new Error(`Unexpected AviationService error: ${String(err)}`)
		}
	}

	async fetchAirlines() {
		const cacheKey = 'airlines'

		// 1. Проверяем кэш
		const cached = this.airlinesCache.get(cacheKey)
		if (cached) {
			console.log('Returning cached airlines')
			return cached
		}

		// 2. Проверяем наличие токена
		if (!this.token) {
			console.warn('⚠️ No API token, returning empty airlines')
			return {
				data: [],
				pagination: { total: 0, offset: 0, limit: 100, count: 0 }
			}
		}

		try {
			console.log('Fetching airlines from AviationStack API...')
			const url = this.getUrl('airlines')
			const response = await axios.get<IFetchAirlinesResponse>(url.toString())

			if (response.status !== 200) {
				throw new Error(`Error fetching airlines: ${response.statusText}`)
			}

			console.log(`✅ Airlines successfully fetched from AviationStack API. Count: ${response.data.data?.length || 0}`)

			// 3. Сохраняем в кэш
			this.airlinesCache.set(cacheKey, response.data)

			return response.data
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const status = err.response?.status
				const message = err.response?.data?.error?.info || err.message
				console.error(`❌ AviationStack API error [${status}]: ${message}`)
				throw new Error(`AviationStack API error [${status}]: ${message}`)
			}

			throw new Error(`Unexpected AviationService error: ${String(err)}`)
		}
	}
}

export default new AviationService()