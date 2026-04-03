import { useQuery } from '@tanstack/react-query'

import { FlightDetails } from '@/components/flight-details/FlightDetails'
import { FlightList } from '@/components/flight-list/FlightList'
import { SkyTrackMap } from '@/components/map/SkyTrackMap'

import { mapToOpenskyState } from '@/services/external/opensky/map-to-opensky-state'
import openskyService from '@/services/external/opensky/opensky.service'
import type { IOpenskyState } from '@/services/external/opensky/opensky.types'

export function Home() {
	const { data, isLoading, error, isSuccess } = useQuery({
		queryKey: ['live flights'],
		queryFn: () => openskyService.fetchLiveFlights(),
		select: data =>
			Array.isArray(data.states)
				? (data.states
						.slice(0, 15)
						.filter(s => Array.isArray(s) && s.length >= 14)
						.map(state => {
							try {
								return mapToOpenskyState(state)
							} catch {
								return null
							}
						})
						.filter(Boolean) as IOpenskyState[])
				: []
	})

	if (error) {
		return (
			<div className='text-red-500'>
				Error fetching live flights: {error.message}
			</div>
		)
	}

	if (isLoading) {
		return <div className='text-gray-500'>Loading live flights...</div>
	}

	if (!data?.length) {
		return <div className='text-gray-500'>No live flights available.</div>
	}

	return (
		<div>
			<FlightList
				flightIcaos={data.map(flight => flight!.icao24)}
				isSuccess={isSuccess}
			/>
			<FlightDetails />
			<div className='absolute inset-0 z-0'>
				<SkyTrackMap flights={data} />
			</div>
		</div>
	)
}
