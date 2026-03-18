import { useEffect, useMemo, useState } from 'react'

import { SkeletonLoader } from '../custom-ui/SkeletonLoader'
import { Filters } from '../filters/Filters'

import { FlightCard } from './FlightCard'
import { FLIGHTS } from './flights.data'

export function FlightList() {
	const [isLoading, setIsLoading] = useState(true)
	const [fromCountry, setFromCountry] = useState<string | null>(null)
	const [currentAirline, setCurrentAirline] = useState<string | null>(null)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 1500)

		return () => {
			clearTimeout(timer)
		}
	}, [])

	const filteredFlights = useMemo(() => {
		return FLIGHTS.filter(flight => {
			if (currentAirline && flight.airline.country !== currentAirline) {
				return false
			}
			if (fromCountry && flight.from.country !== fromCountry) {
				return false
			}
			return true
		})
	}, [currentAirline, fromCountry])

	return (
		<div className='w-sm sm:w-full md:w-xs'>
			<Filters
				fromCountry={fromCountry}
				setFromCountry={setFromCountry}
				currentAirline={currentAirline}
				setCurrentAirline={setCurrentAirline}
			/>
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
