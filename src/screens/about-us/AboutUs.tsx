import { CenterLayout } from '@/components/CenterLayout'
import { Heading } from '@/components/custom-ui/Heading'
import { SubHeading } from '@/components/custom-ui/SubHeading'
import { Plane, Globe, Users, Clock, Shield, Heart, Target } from 'lucide-react'

export function AboutUs() {
  const stats = [
    { value: '50K+', label: 'Monthly Users', icon: Users },
    { value: '10K+', label: 'Flights Tracked', icon: Plane },
    { value: '150+', label: 'Countries', icon: Globe },
    { value: '99.9%', label: 'Uptime', icon: Clock },
  ]

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'Making flight data accessible to everyone'
    },
    {
      icon: Shield,
      title: 'Our Vision',
      description: 'World\'s most trusted flight tracking platform'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'Transparency, accuracy, innovation'
    }
  ]

  return (
    <CenterLayout>
      <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero */}
        <div className='text-center mb-12'>
          <Heading>About Us</Heading>
          <SubHeading>
            We are aviation enthusiasts dedicated to providing real-time flight tracking
            for everyone — from casual observers to industry professionals.
          </SubHeading>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-12'>
          {stats.map((stat, idx) => (
            <div key={idx} className='bg-card rounded-xl border border-border p-4 text-center'>
              <stat.icon className='w-8 h-8 text-primary mx-auto mb-2' />
              <div className='text-2xl font-bold text-foreground'>{stat.value}</div>
              <div className='text-xs text-muted-foreground'>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission, Vision, Values */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          {values.map((item, idx) => (
            <div key={idx} className='bg-card rounded-xl border border-border p-5 text-center'>
              <item.icon className='w-10 h-10 text-primary mx-auto mb-3' />
              <h3 className='text-lg font-semibold text-foreground mb-2'>{item.title}</h3>
              <p className='text-sm text-muted-foreground'>{item.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works - проще */}
        <div className='bg-card rounded-xl border border-border p-6 mb-12'>
          <h2 className='text-xl font-bold text-foreground text-center mb-6'>How It Works</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center'>
              <div className='w-8 h-8 bg-primary/10 rounded-full text-primary font-bold flex items-center justify-center mx-auto mb-2'>1</div>
              <p className='text-sm'>Data Collection</p>
            </div>
            <div className='text-center'>
              <div className='w-8 h-8 bg-primary/10 rounded-full text-primary font-bold flex items-center justify-center mx-auto mb-2'>2</div>
              <p className='text-sm'>Data Processing</p>
            </div>
            <div className='text-center'>
              <div className='w-8 h-8 bg-primary/10 rounded-full text-primary font-bold flex items-center justify-center mx-auto mb-2'>3</div>
              <p className='text-sm'>Real-time Display</p>
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className='bg-primary/5 rounded-xl border border-border p-6 text-center mb-8'>
          <h2 className='text-xl font-bold text-foreground mb-2'>Trusted Worldwide</h2>
          <p className='text-muted-foreground text-sm mb-4'>
            Join thousands of users relying on SkyTracker
          </p>
          <div className='flex flex-wrap justify-center gap-2'>
            {['Real-time', 'Global', 'Secure', 'Free'].map((feature, idx) => (
              <span key={idx} className='px-3 py-1 bg-background rounded-full text-xs'>
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className='text-center'>
          <a 
            href='/' 
            className='inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
          >
            Explore Flights
            <Plane className='w-4 h-4' />
          </a>
        </div>
      </div>
    </CenterLayout>
  )
}