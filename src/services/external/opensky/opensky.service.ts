import axios from 'axios'

export const testIcao24List: string[] = [
	'a0f1bb', // American Airlines A321
	'39de4e', // Transavia France
	'3c6624', // Lufthansa
	'4ca4e6', // Ryanair
	'484c25', // KLM
	'4406e4', // Austrian Airlines
	'3c4b2e', // Lufthansa
	'49524e', // easyJet
	'43c4f1', // British Airways
	'c05db8' // Air Canada
]

class OpenSkyService {
	private apiUrl: string
	private clientId: string
	private token: string

	constructor() {
		this.apiUrl = 'https://opensky-network.org/api'
		this.clientId = import.meta.env.VITE_API_OPENSKY_CLIENT_ID
		this.token = import.meta.env.VITE_API_OPENSKY_CLIENT_SECRET
	}

	private async getOpenSkyToken(): Promise<string> {
		const response = await axios.post(
			'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token',
			new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: this.clientId,
				client_secret: this.token
			}),
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
		)

		return response.data.access_token
	}

	async fetchLiveFlightsByIcao24(icao24List: string[]) {
		if (!icao24List.length) return []

		// const token = await this.getOpenSkyToken()

		const params = new URLSearchParams()

		icao24List = testIcao24List

		icao24List.forEach(icao24 => params.append('icao24', icao24))

		const response = await axios.get(`${this.apiUrl}/states/all`, {
			headers: {
				Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0SVIwSDB0bmNEZTlKYmp4dFctWEtqZ0RYSWExNnR5eU5DWHJxUzJQNkRjIn0.eyJleHAiOjE3NTM3MDI4NzEsImlhdCI6MTc1MzcwMTA3MSwianRpIjoiOGZhZTQ4OTItZGRiMy00ZGZjLTgxYzgtMTFmZGU5NzFmYzk2IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLm9wZW5za3ktbmV0d29yay5vcmcvYXV0aC9yZWFsbXMvb3BlbnNreS1uZXR3b3JrIiwiYXVkIjpbIndlYnNpdGUtdWkiLCJhY2NvdW50Il0sInN1YiI6ImI4MjhjNzA3LTVmMmMtNGExMC04Yzc4LWY2NTcyNTZjNDQ4NiIsInR5cCI6IkJlYXJlciIsImF6cCI6InJndGVzdDU2Ny1hcGktY2xpZW50IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsIk9QRU5TS1lfQVBJX0RFRkFVTFQiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtb3BlbnNreS1uZXR3b3JrIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsid2Vic2l0ZS11aSI6eyJyb2xlcyI6WyJvcGVuc2t5X3dlYnNpdGVfdXNlciJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiY2xpZW50SWQiOiJyZ3Rlc3Q1NjctYXBpLWNsaWVudCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjEyMi40My4xNDMuMTYxIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LXJndGVzdDU2Ny1hcGktY2xpZW50IiwiY2xpZW50QWRkcmVzcyI6IjEyMi40My4xNDMuMTYxIn0.ch7TGJPiFE5-cHNWXy0d5gUDvcT1OdebSYdOGA155GOGGmH-jD5tH4GecWRifKYG4KEA53MMaVpvzEdCLeQkdCwLeZ_iJBuu1uxxya0xC67k5ckW0n2hZQn0L8_5fsvkHEL5Cto7Xkqv3HXIHkv3gjH8PH1ZYBW60R1gMR0vdtP6YuwZJRd7SscHweHIhplrf6oq0ftf1Qz_xmJDD6fhi4JVfttFRp4qM-8xi3OOfKCeTi7mzoOKni48iuRthXKBPnzCNQ8MkobVJBZ6uVBdf5YWrtvscaCF3Ob8OjD9R4FFYqme-EDUzftl8amz5rE61CFGzoZsmwYWdYnsMpteKw`
			},
			params
		})

		console.log('OpenSky response:', response.data)

		return response.data
	}
}

export default new OpenSkyService()
