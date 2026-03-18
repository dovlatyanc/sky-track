import { FLIGHTS } from '../flight-list/flights.data'

import { FilterSearchSelect } from './FilterSearchSelect'

const fromCountries = [...new Set(FLIGHTS.map(flight => flight.from.country))]
const airlines = [...new Set(FLIGHTS.map(flight => flight.airline.country))]

interface Props {
	fromCountry: string | null
	setFromCountry: (country: string | null) => void

	currentAirline: string | null
	setCurrentAirline: (airline: string | null) => void
}

export function Filters({
	fromCountry,
	setFromCountry,
	currentAirline,
	setCurrentAirline
}: Props) {
	return (
		<div className='mb-4 ml-1 grid grid-cols-2 gap-3'>
			<FilterSearchSelect
				data={fromCountries}
				entityName='country'
				value={fromCountry}
				onChange={setFromCountry}
			/>
			<FilterSearchSelect
				data={airlines}
				entityName='airline'
				value={currentAirline}
				onChange={setCurrentAirline}
			/>
		</div>
	)
}
