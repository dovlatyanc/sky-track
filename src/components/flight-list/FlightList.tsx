import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'

import { RefreshCw } from '../animate-ui/icons/refresh-cw'
import { SkeletonLoader } from '../custom-ui/SkeletonLoader'
import { Filters } from '../filters/Filters'
import { Button } from '../ui/button'

import { FlightCard } from './FlightCard'
import { formatDate } from './format-date'
import aviationService from '@/services/external/aviation/aviation.service'

export function FlightList() {
	const [fromCountry, setFromCountry] = useState<string | null>(null)
	const [currentAirline, setCurrentAirline] = useState<string | null>(null)

	const lastUpdateRef = useRef<Date | null>(null)

	const { data, isPending, refetch, isRefetching } = useQuery({
		queryKey: ['flights', fromCountry, currentAirline],
		queryFn: async () => {
			const result = await aviationService.fetchFlights({
				airline: currentAirline,
				fromCountry
			})

			lastUpdateRef.current = new Date()
			return result
		}
	})

	// <RefreshCw animateOnHover />

	return (
		<div className='relative z-10 w-sm sm:w-full md:w-xs'>
			<Filters
				fromCountry={fromCountry}
				setFromCountry={setFromCountry}
				currentAirline={currentAirline}
				setCurrentAirline={setCurrentAirline}
			/>

			<div className='absolute top-0 -right-12.5'>
				<Button
					onClick={() => refetch()}
					disabled={isRefetching}
					variant='secondary'
				>
					<RefreshCw animateOnHover />
				</Button>
			</div>

			{lastUpdateRef.current && (
				<div className='text-muted-foreground mt-3 text-center text-xs italic opacity-50'>
					{isRefetching ? (
						<>Updating...</>
					) : (
						<>Last update: {formatDate(lastUpdateRef.current)}</>
					)}
				</div>
			)}

			<div className='max-h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] space-y-4 overflow-x-hidden overflow-y-auto pt-3 pb-8'>
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
