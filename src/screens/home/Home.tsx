import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'

import { FlightDetails } from '@/components/flight-details/FlightDetails'
import { FlightList } from '@/components/flight-list/FlightList'

import { trpc } from '@/lib/trpc'

export function Home() {
	const lastUpdateRef = useRef<Date | null>(new Date())

	const { data, isLoading, error, refetch, isRefetching } =
		trpc.flights.getLive.useQuery({
			limit: 10
		})

	useEffect(() => {
		if (data && data.length > 0) {
			lastUpdateRef.current = new Date()
		}
	}, [data])

	const [searchParams] = useSearchParams()
	const selectedFlight = searchParams.get('flight')

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

	const activeFlight = data.find(flight => flight.id === selectedFlight)

	return (
		<div>
			<FlightList
				flights={data}
				lastUpdate={lastUpdateRef.current}
				isRefetching={isRefetching}
				isPending={isLoading}
				refetch={refetch}
			/>
			{activeFlight && <FlightDetails flight={activeFlight} />}
			{/* <div className='absolute inset-0 z-0'>
				<SkyTrackMap flights={data} />
			</div> */}
		</div>
	)
}
