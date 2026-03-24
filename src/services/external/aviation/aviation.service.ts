import axios from 'axios'

import type {
	IFetchFlightsParams,
	IFetchFlightsResponse
} from './aviation.types'

class AviationService {
	private apiUrl: string
	private token: string

	constructor() {
		this.apiUrl = 'https://api.aviationstack.com/v1'
		this.token = import.meta.env.VITE_API_TOKEN
	}

	private get getFlightsUrl() {
		const url = new URL(`${this.apiUrl}/flights`)
		url.searchParams.append('access_key', this.token)
		return url
	}

	async fetchFlights({
		airline,
		fromCountry,
		limit = 10,
		offset
	}: IFetchFlightsParams) {
		const url = this.getFlightsUrl

		if (airline) {
			url.searchParams.append('airline_iata', airline)
		}
		if (fromCountry) {
			url.searchParams.append('country_iso2', fromCountry)
		}
		if (limit) {
			url.searchParams.append('limit', limit.toString())
		}
		if (offset) {
			url.searchParams.append('offset', offset.toString())
		}

		const response = await axios.get<IFetchFlightsResponse>(url.toString())

		if (response.status !== 200) {
			throw new Error(`Error fetching flights: ${response.statusText}`)
		}

		return response.data
	}
}

export default new AviationService()
