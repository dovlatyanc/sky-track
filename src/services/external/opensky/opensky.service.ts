import axios from 'axios'

import { ACCESS_TOKEN } from './opensky.token'

class OpenSkyService {
	private apiUrl: string

	constructor() {
		this.apiUrl = 'https://opensky-network.org/api'
	}

	async fetchLiveFlightsByIcao24(icao24List: string[]) {
		if (!icao24List.length) return []

		const params = new URLSearchParams()

		icao24List.forEach(icao24 => params.append('icao24', icao24))

		const response = await axios.get(`${this.apiUrl}/states/all`, {
			headers: {
				Authorization: `Bearer ${ACCESS_TOKEN}`
			},
			params
		})

		return response.data
	}
}

export default new OpenSkyService()
