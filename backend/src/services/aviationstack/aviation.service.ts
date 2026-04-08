import axios from 'axios'
import dotenv from 'dotenv'

import type { IFetchFlightsResponse } from './aviation.types'

dotenv.config()

class AviationService {
	private apiUrl: string
	private token: string

	constructor() {
		this.apiUrl = 'https://api.aviationstack.com/v1'
		this.token = process.env.AVIATIONSTACK_API_TOKEN!
	}

	private get getFlightsUrl() {
		const url = new URL(`${this.apiUrl}/flights`)
		url.searchParams.append('access_key', this.token)
		return url
	}

	async fetchLiveFlights(limit = 15) {
		const url = this.getFlightsUrl
		url.searchParams.set('limit', limit.toString())
		// TEST
		url.searchParams.set('flight_status', 'active')

		try {
			console.log('Fetching flights from AviationStack API')
			const response = await axios.get<IFetchFlightsResponse>(url.toString())

			if (response.status !== 200) {
				throw new Error(`Error fetching flights: ${response.statusText}`)
			}

			console.log('Flights successfully fetched from AviationStack API')

			return response.data
		} catch (err) {
			console.error('Error fetching flights from AviationStack API', err)
		}
	}
}

export default new AviationService()
