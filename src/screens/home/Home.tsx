import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

import { FlightDetails } from '@/components/flight-details/FlightDetails'
import { FlightList } from '@/components/flight-list/FlightList'
import { SkyTrackMap } from '@/components/map/SkyTrackMap'

import { trpc } from '@/lib/trpc'

export function Home() {
	const lastUpdateRef = useRef<Date | null>(new Date())

	const [currentAirline, setCurrentAirline] = useState<string | undefined>(
		undefined
	)
	const [fromCountry, setFromCountry] = useState<string | undefined>(undefined)

	const {
		data,
		isLoading,
		error,
		refetch,
		isRefetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = trpc.flights.getLive.useInfiniteQuery(
		{
			limit: 10,
			airlineName: currentAirline
		},
		{
			getNextPageParam: lastPage => {
				return lastPage.nextCursor
			},
			select: data => {
				return data.pages.flatMap(page => page.items) ?? []
			}
		}
	)

	useEffect(() => {
		const interval = setInterval(() => {
			// refetch()
		}, 10000) // Refetch every 10 seconds

		return () => clearInterval(interval)
	}, [refetch])

	useEffect(() => {
		if (data && data.length > 0) {
			lastUpdateRef.current = new Date()
		}
	}, [data])

	const filteredData = useMemo(
		() =>
			data
				?.filter(f => !!f)
				.filter(flight => {
					if (currentAirline && flight?.airline.name !== currentAirline) {
						return false
					}
					if (fromCountry && flight?.from.countryName !== fromCountry) {
						return false
					}
					return true
				}),
		[currentAirline, data, fromCountry]
	)

	const [searchParams] = useSearchParams()
	const selectedFlight = searchParams.get('flight')

	const activeFlight = useMemo(
		() => data?.find(flight => flight?.id === selectedFlight),
		[data, selectedFlight]
	)


	return error ? (
		<div className='relative z-10 w-sm text-red-500 sm:w-full md:w-xs'>
			Error fetching live flights: {error.message}
		</div>
	) : (
		<div>
			<FlightList
				flights={filteredData || []}
				lastUpdate={lastUpdateRef.current}
				isRefetching={isRefetching}
				isPending={isLoading}
				refetch={refetch}
				currentAirline={currentAirline}
				setCurrentAirline={setCurrentAirline}
				fromCountry={fromCountry}
				setFromCountry={setFromCountry}
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
			/>
			{activeFlight && <FlightDetails flight={activeFlight} />}
			<div className='absolute inset-0 z-0 h-screen w-screen'>
				<SkyTrackMap flights={filteredData || []} activeFlight={activeFlight} />
			</div>
		</div>
	)
}
