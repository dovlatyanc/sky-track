import { FilterSearchSelect } from './FilterSearchSelect'

interface Props {
	fromCountry: string | undefined
	setFromCountry: (country: string | undefined) => void

	currentAirline: string | undefined
	setCurrentAirline: (airline: string | undefined) => void

	countries: string[]
	isLoading: boolean

	airlines: string[]
}

export function Filters({
	fromCountry,
	setFromCountry,
	currentAirline,
	setCurrentAirline,
	countries,
	isLoading,
	airlines
}: Props) {
	return (
		<div className='ml-1 grid grid-cols-2 gap-3'>
			<FilterSearchSelect
				data={countries}
				entityName='country'
				value={fromCountry}
				onChange={setFromCountry}
				isLoading={isLoading}
			/>
			<FilterSearchSelect
				data={airlines}
				entityName='airline'
				value={currentAirline}
				onChange={setCurrentAirline}
				isLoading={isLoading}
			/>
		</div>
	)
}
