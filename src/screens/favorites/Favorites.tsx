import { CenterLayout } from '@/components/CenterLayout'
import { Heading } from '@/components/custom-ui/Heading'
import { SkeletonLoader } from '@/components/custom-ui/SkeletonLoader'
import { SubHeading } from '@/components/custom-ui/SubHeading'
import { FlightCard } from '@/components/flight-list/FlightCard'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '@/hooks/useAppSelector'
import { trpc } from '@/lib/trpc'

export function Favorites() {
  const { t } = useTranslation('favorites')
  const favorites = useAppSelector(state => state.favorites)

  const { data, isLoading } = trpc.flights.getLive.useQuery(
    {
      limit: 30
    },
    {
      select: data => {
        return {
          items:
            data.items.filter(flight => favorites.includes(flight?.id ?? '')) ||
            []
        }
      }
    }
  )

  const hasItems = data?.items && data.items.length > 0

  return (
    <CenterLayout>
      <div className='w-full max-w-2xl mx-auto px-4'>
        <Heading>{t('title')}</Heading>
        <SubHeading>
          {t('description')}
        </SubHeading>

        <div className='flex flex-col gap-3 mt-4'>
          {isLoading ? (
            <>
              <SkeletonLoader className='h-40' />
              <SkeletonLoader className='h-40' />
              <SkeletonLoader className='h-40' />
            </>
          ) : (
            hasItems &&
            data?.items.map(flight => (
              <FlightCard key={flight?.id} flight={flight} />
            ))
          )}
        </div>

        {!isLoading && !hasItems && (
          <p className='mt-8 text-center text-muted-foreground'>
            {t('empty')}
          </p>
        )}
      </div>
    </CenterLayout>
  )
}