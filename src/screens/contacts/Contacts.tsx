import { CenterLayout } from '@/components/CenterLayout'
import { Heading } from '@/components/custom-ui/Heading'
import { SubHeading } from '@/components/custom-ui/SubHeading'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { SimpleMap } from '@/components/map/SimpleMap'

export function Contacts() {
  // Координаты офиса (пример — можно заменить на свои)
  const officeLocation = {
    lat: 55.751244,
    lng: 37.618423,
    title: 'SkyTracker Office',
    description: '123 Aviation Boulevard, Sky City'
  }

  return (
    <CenterLayout>
      <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Heading>Contacts</Heading>
        <SubHeading>
          We're here to help! Reach out to us through any of the channels below.
        </SubHeading>
        
        {/* Карточки контактов (оставляем как есть) */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
          {/* Email Card */}
          <div className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all'>
            <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
              <Mail className='w-6 h-6 text-primary' />
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>Email Us</h3>
            <p className='text-muted-foreground text-sm mb-3'>For general inquiries and support</p>
            <a href='mailto:test@test.ru' className='text-primary hover:underline font-medium'>
              test@test.ru
            </a>
          </div>
          
          {/* Phone Card */}
          <div className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all'>
            <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
              <Phone className='w-6 h-6 text-primary' />
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>Call Us</h3>
            <p className='text-muted-foreground text-sm mb-3'>Mon-Fri 9:00 - 18:00</p>
            <a href='tel:+1234567890' className='text-primary hover:underline font-medium'>
              +1 (234) 567-890
            </a>
          </div>
          
          {/* Office Card */}
          <div className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all'>
            <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
              <MapPin className='w-6 h-6 text-primary' />
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>Visit Us</h3>
            <p className='text-muted-foreground text-sm mb-3'>
              123 Aviation Boulevard, Sky City, SK 12345
            </p>
          </div>
        </div>
        
        {/* Часы работы и карта в одной строке */}
        <div className='mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Часы работы */}
          <div className='bg-card rounded-xl border border-border p-6'>
            <h3 className='text-xl font-semibold text-foreground mb-4'>Office Hours</h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-border/50'>
                <span className='flex items-center gap-2 text-muted-foreground'>
                  <Clock className='w-4 h-4' />
                  Monday - Friday
                </span>
                <span className='text-foreground font-medium'>9:00 - 18:00</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-border/50'>
                <span className='flex items-center gap-2 text-muted-foreground'>
                  <Clock className='w-4 h-4' />
                  Saturday
                </span>
                <span className='text-foreground font-medium'>10:00 - 15:00</span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='flex items-center gap-2 text-muted-foreground'>
                  <Clock className='w-4 h-4' />
                  Sunday
                </span>
                <span className='text-foreground font-medium'>Closed</span>
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