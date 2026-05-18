import type { TFlight } from '@/lib/trpc'
import { useTranslation } from 'react-i18next'

interface Props {
  flight: TFlight
}

export function FlightSchedule({ flight }: Props) {
  const { t } = useTranslation('flightSchedule')

  return (
    <div className='xs:text-sm'>
      <div className='mb-1 grid grid-cols-2 gap-1'>
        <div className='bg-card p-mini-element flex items-center justify-between'>
          <p className='text-muted-foreground'>{t('scheduled')}</p>
          <p>{flight?.schedule.departure.scheduled.localTime}</p>
        </div>
        <div className='bg-card p-mini-element flex items-center justify-between'>
          <p className='text-muted-foreground'>{t('actual')}</p>
          <p>{flight?.schedule.departure.actual.localTime}</p>
        </div>
      </div>
      <div className='mb-1 grid grid-cols-2 gap-1'>
        <div className='bg-card p-mini-element flex items-center justify-between rounded-bl-xl'>
          <p className='text-muted-foreground'>{t('scheduled')}</p>
          <p>{flight?.schedule.arrival.scheduled.localTime}</p>
        </div>
        <div className='bg-card p-mini-element flex items-center justify-between rounded-br-xl'>
          <p className='text-muted-foreground'>{t('estimated')}</p>
          <p>{flight?.schedule.arrival.actual.localTime}</p>
        </div>
      </div>
    </div>
  )
}