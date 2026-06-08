import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('filters')

  return (
    <div className='xs:gap-2 xs:ml-0 xs:flex xs:justify-center xs:flex-wrap xs:w-11/12 ml-1 grid grid-cols-2 gap-3'>
      <FilterSearchSelect
        data={countries}
        entityName={t('country')}
        value={fromCountry}
        onChange={setFromCountry}
        isLoading={isLoading}
      />
      <FilterSearchSelect
        data={airlines}
        entityName={t('airline')}
        value={currentAirline}
        onChange={setCurrentAirline}
        isLoading={isLoading}
      />
    </div>
  )
}