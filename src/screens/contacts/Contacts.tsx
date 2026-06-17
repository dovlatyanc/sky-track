import { CenterLayout } from '@/components/CenterLayout'
import { Heading } from '@/components/custom-ui/Heading'
import { SubHeading } from '@/components/custom-ui/SubHeading'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { SimpleMap } from '@/components/map/SimpleMap'
import { useTranslation } from 'react-i18next'

export function Contacts() {
  const { t } = useTranslation('contacts')

  const officeLocation = {
    lat: 55.751244,
    lng: 37.618423,
    title: t('office.map_title'),
    description: t('office.address')
  }

  return (
    <CenterLayout>
      <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Heading>{t('title')}</Heading>
        <SubHeading>
          {t('subtitle')}
        </SubHeading>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
          {/* Email Card */}
          <div className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all'>
            <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
              <Mail className='w-6 h-6 text-primary' />
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>{t('email.title')}</h3>
            <p className='text-muted-foreground text-sm mb-3'>{t('email.description')}</p>
            <a href='mailto:test@test.ru' className='text-primary hover:underline font-medium'>
              test@test.ru
            </a>
          </div>
          
          {/* Phone Card */}
          <div className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all'>
            <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
              <Phone className='w-6 h-6 text-primary' />
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>{t('phone.title')}</h3>
            <p className='text-muted-foreground text-sm mb-3'>{t('phone.description')}</p>
            <a href='tel:+1234567890' className='text-primary hover:underline font-medium'>
              +1 (234) 567-890
            </a>
          </div>
          
          {/* Office Card */}
          <div className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all'>
            <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
              <MapPin className='w-6 h-6 text-primary' />
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>{t('office.title')}</h3>
            <p className='text-muted-foreground text-sm mb-3'>
              {t('office.address')}
            </p>
          </div>
        </div>
        
        <div className='mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Часы работы */}
              <div className='bg-card rounded-xl border border-border p-4 sm:p-6'>
                <h3 className='text-lg sm:text-xl font-semibold text-foreground mb-4'>{t('hours.title')}</h3>
                <div className='space-y-3'>
                  <div className='py-2 border-b border-border/50'>
                    <div className='flex items-center gap-2 text-muted-foreground text-sm xs:text-base'>
                      <Clock className='w-4 h-4 flex-shrink-0' />
                      <span>{t('hours.weekdays')}</span>
                    </div>
                    <div className='text-foreground font-medium text-sm xs:text-base mt-1'>
                      9:00 - 18:00
                    </div>
                  </div>
                  <div className='py-2 border-b border-border/50'>
                    <div className='flex items-center gap-2 text-muted-foreground text-sm xs:text-base'>
                      <Clock className='w-4 h-4 flex-shrink-0' />
                      <span>{t('hours.saturday')}</span>
                    </div>
                    <div className='text-foreground font-medium text-sm xs:text-base mt-1'>
                      10:00 - 15:00
                    </div>
                  </div>
                  <div className='py-2'>
                    <div className='flex items-center gap-2 text-muted-foreground text-sm xs:text-base'>
                      <Clock className='w-4 h-4 flex-shrink-0' />
                      <span>{t('hours.sunday')}</span>
                    </div>
                    <div className='text-foreground font-medium text-sm xs:text-base mt-1'>
                      {t('hours.closed')}
                    </div>
                  </div>
                </div>
        </div>
          
          {/* Карта */}
          <SimpleMap
            center={[officeLocation.lat, officeLocation.lng]}
            zoom={14}
            markers={[officeLocation]}
            height="300px"
          />
        </div>
      </div>
    </CenterLayout>
  )
}