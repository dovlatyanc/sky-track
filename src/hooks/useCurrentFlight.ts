import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

import { QUERY_PARAM_FLIGHT } from '@/components/flight-list/flights.constants'

import aviationService from '@/services/external/aviation/aviation.service'

export const useCurrentFlight = () => {
	const [searchParams] = useSearchParams()
	const selectedFlight = searchParams.get(QUERY_PARAM_FLIGHT)

	const { data } = useQuery({
		queryKey: ['current flight', selectedFlight],
		queryFn: () => aviationService.fetchFlightByIcao(selectedFlight!),
		enabled: !!selectedFlight
	})

	return { flight: data }
}
