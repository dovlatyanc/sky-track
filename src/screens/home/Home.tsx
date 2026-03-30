import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { FlightDetails } from '@/components/flight-details/FlightDetails'
import { FlightList } from '@/components/flight-list/FlightList'
import { SkyTrackMap } from '@/components/map/SkyTrackMap'

import openskyService from '@/services/external/opensky/opensky.service'

export function Home() {
	const [icao24, setIcao24] = useState<string[]>([])

	const { data } = useQuery({
		queryKey: ['live flights', icao24],
		queryFn: () => openskyService.fetchLiveFlightsByIcao24(icao24)
	})

	console.log('Live flights data:', data)
	console.log('Selected ICAO24:', icao24)//уникальные идентификаторы воздушных судов

	return (
		<div>
			<FlightList setIcao24={setIcao24} />
			<FlightDetails />
			<div className='absolute inset-0 z-0'>
				<SkyTrackMap />
			</div>
		</div>
	)
}
