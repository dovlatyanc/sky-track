import { useEffect, useMemo, useState } from 'react'

import { SkeletonLoader } from '../custom-ui/SkeletonLoader'
import { Filters } from '../filters/Filters'

import { FlightCard } from './FlightCard'
import { FLIGHTS } from './flights.data'

export function FlightList() {
	const [isLoading, setIsLoading] = useState(true)
	const [fromCountry, setFromCountry] = useState<string | null>(null)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 1500)

		return () => {
			clearTimeout(timer)
		}
	}, [])

	const filteredFlights = useMemo(() => {
		if (!fromCountry) return FLIGHTS
		return FLIGHTS.filter(flight => flight.from.country === fromCountry)
	}, [fromCountry])

	return (
		<div className='w-sm sm:w-full md:w-xs'>
			<Filters fromCountry={fromCountry} setFromCountry={setFromCountry} />
			<div className='space-y-4'>
				{isLoading ? (
					<SkeletonLoader count={5} className='mb-4 h-40' />
				) : (
					!!filteredFlights.length &&
					filteredFlights.map(flight => (
						<FlightCard key={flight.id} flight={flight} />
					))
				)}
			</div>
		</div>
	)
}
