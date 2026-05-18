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
		<div className='xs:gap-2 xs:ml-0 xs:flex xs:justify-center xs:flex-wrap xs:w-11/12 ml-1 grid grid-cols-2 gap-3'>
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
