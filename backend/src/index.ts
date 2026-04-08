import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import aviationService from './services/aviationstack/aviation.service'
import openskyService from './services/opensky/opensky.service'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5174

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true
	})
)

app.use(express.json())

app.get('/api/flights/live', async (req, res) => {
	const data = await openskyService.fetchLiveFlights()
	res.json(data)
})

app.get('/api/flights/:icao24', async (req, res) => {
	const { icao24 } = req.params
	const data = await aviationService.fetchFlightByIcao(icao24)
	res.json(data)
})

app.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`)
	console.log(`📡 CORS enabled for http://localhost:${PORT}`)
	console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
	console.log('[GET] /api/flights/live - Fetch live flights from OpenSky')
	console.log(
		'[GET] /api/flights?icao=ICAO24 - Fetch flight by ICAO from AviationStack'
	)
})
