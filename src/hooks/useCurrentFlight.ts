import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { QUERY_PARAM_FLIGHT } from '@/components/flight-list/flights.constants'
import { FLIGHTS } from '@/components/flight-list/flights.data'

export const useCurrentFlight = () => {
	const [searchParams] = useSearchParams()
	const selectedFlight = searchParams.get(QUERY_PARAM_FLIGHT)

	const flight = useMemo(
		() => FLIGHTS.find(flight => flight.id === selectedFlight),
		[selectedFlight]
	)

	return { flight }
}
