import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { SkeletonLoader } from '../custom-ui/SkeletonLoader'
import { Filters } from '../filters/Filters'

import { FlightCard } from './FlightCard'
import aviationService from '@/services/external/aviation/aviation.service'

export function FlightList() {
	const [fromCountry, setFromCountry] = useState<string | null>(null)
	const [currentAirline, setCurrentAirline] = useState<string | null>(null)

	const { data, isPending } = useQuery({
		queryKey: ['flights', fromCountry, currentAirline],
		queryFn: () =>
			aviationService.fetchFlights({
				airline: currentAirline,
				fromCountry
			})
	})

	return (
		<div className='relative z-10 w-sm sm:w-full md:w-xs'>
			<Filters
				fromCountry={fromCountry}
				setFromCountry={setFromCountry}
				currentAirline={currentAirline}
				setCurrentAirline={setCurrentAirline}
			/>
			<div className='max-h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] space-y-4 overflow-x-hidden overflow-y-auto pt-4 pb-8'>
				{isPending ? (
					<SkeletonLoader count={5} className='mb-4 h-40' />
				) : (
					!!data?.data.length &&
					data.data.map(flight => (
						<FlightCard key={flight.flight.number} flight={flight} />
					))
				)}
			</div>
		</div>
	)
}
