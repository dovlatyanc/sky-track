import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'

import type { TInfiniteQueryResponseFlight } from '@/types/flight.types'

import { RefreshCw } from '../animate-ui/icons/refresh-cw'
import { SkeletonLoader } from '../custom-ui/SkeletonLoader'
import { Filters } from '../filters/Filters'
import { Button } from '../ui/button'

import { FlightCard } from './FlightCard'
import { formatDate } from './format-date'

interface Props {
  flights: TInfiniteQueryResponseFlight[]
  refetch: () => void
  isRefetching: boolean
  isPending: boolean
  lastUpdate: Date | null

  currentAirline: string | undefined
  setCurrentAirline: (airline: string | undefined) => void

  fromCountry: string | undefined
  setFromCountry: (country: string | undefined) => void

  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

export function FlightList({
  flights,
  isRefetching,
  isPending,
  lastUpdate,
  refetch,
  currentAirline,
  setCurrentAirline,
  fromCountry,
  setFromCountry,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
}: Props) {
  const { t } = useTranslation('flightList')
  const { ref: loadMoreRef, inView } = useInView({ rootMargin: '100px' })
  const lastFetchRef = useRef(0)
  const [isShowList, setIsShowList] = useState(true)

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      const now = Date.now()
      if (now - lastFetchRef.current < 4000) return
      lastFetchRef.current = now

      console.log('⬇️ Loading next page...')
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])

  const selectCountries = useMemo(
    () =>
      Array.from(
        new Set(
          flights.map(f => f?.from.countryName).filter((f): f is string => !!f)
        )
      ),
    [flights]
  )

  const selectAirlines = useMemo(
    () =>
      Array.from(
        new Set(
          flights.map(f => f?.airline.name).filter((f): f is string => !!f)
        )
      ),
    [flights]
  )

  return (
    <div className='xs:w-full relative z-10 w-sm md:w-[26rem]'>
      <Filters
        fromCountry={fromCountry}
        setFromCountry={setFromCountry}
        currentAirline={currentAirline}
        setCurrentAirline={setCurrentAirline}
        isLoading={isPending}
        countries={selectCountries}
        airlines={selectAirlines}
      />

      <div className='xs:right-0 xs:space-y-2 absolute top-0 -right-12.5'>
        <Button
          onClick={() => refetch()}
          disabled={isRefetching}
          variant='secondary'
          className='xs:size-8 xs:mt-0.5'
        >
          <RefreshCw animateOnHover animateOnTap />
        </Button>

        <Button
          onClick={() => setIsShowList(!isShowList)}
          variant='secondary'
          className='xs:size-8 xs:flex hidden items-center justify-center'
        >
          {isShowList ? <ArrowUpFromLine /> : <ArrowDownFromLine />}
        </Button>
      </div>

      {lastUpdate && (
        <div className='text-muted-foreground mt-3 text-center text-xs italic opacity-50'>
          {isRefetching ? (
            <>{t('updating')}</>
          ) : (
            <>{t('last_update')}: {formatDate(lastUpdate)}</>
          )}
        </div>
      )}

      {isShowList && (
        <div className='overflow-y-auto max-h-[calc(100vh-120px)] space-y-4 pt-3 pb-8'>
          {isPending ? (
            <SkeletonLoader count={5} className='mb-4 h-40' />
          ) : (
            !!flights?.length &&
            flights.map((flight, index) => (
              <FlightCard key={flight?.id} flight={flight} index={index} />
            ))
          )}

          {isFetchingNextPage && (
            <>
              <SkeletonLoader count={3} className='mb-4 h-40' />
              <div className='text-center text-muted-foreground text-sm py-2'>
                {t('loading_next')}
              </div>
            </>
          )}

          <div ref={loadMoreRef} />
        </div>
      )}
    </div>
  )
}