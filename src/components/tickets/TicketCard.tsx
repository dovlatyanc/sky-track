import { Plane } from 'lucide-react'
import { TicketFavoriteButton } from './TicketFavoriteButton'
import { useCart } from '@/hooks/useCart'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Ticket {
  id: string
  from: { code: string; city: string; country: string }
  to: { code: string; city: string; country: string }
  price: number
  departureTime: string
  arrivalTime: string
  duration: string
  airline: string
  flightNumber: string
  stops: number
}

interface Props {
  ticket: Ticket
}

export function TicketCard({ ticket }: Props) {
  const { t } = useTranslation('ticket')
  const { addToCart, isAdding } = useCart()
  const [added, setAdded] = useState(false)
  
  const handleAddToCart = () => {
    addToCart(ticket.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }
  
  const getStopsText = (stops: number) => {
    if (stops === 0) return t('direct')
    if (stops === 1) return `${stops} ${t('stop')}`
    return `${stops} ${t('stops')}`
  }
  
  return (
    <div className="relative border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 xs:p-4 bg-card text-card-foreground">
      <div className="absolute top-2 right-2 xs:top-3 xs:right-3">
        <TicketFavoriteButton ticketId={ticket.id} size={18} />
      </div>

      <div className="mb-2 xs:mb-3 pr-6 xs:pr-8">
        <p className="text-xs xs:text-sm font-semibold text-foreground truncate">{ticket.airline}</p>
        <p className="text-[10px] xs:text-xs text-muted-foreground">{ticket.flightNumber}</p>
      </div>

      <div className="flex items-center justify-between gap-1 xs:gap-2 mb-2 xs:mb-3">
        <div className="text-center flex-1 min-w-0">
          <p className="text-base xs:text-xl font-bold text-foreground">{ticket.from.code}</p>
          <p className="text-[10px] xs:text-xs text-muted-foreground truncate">{ticket.from.city}</p>
        </div>
        
        <div className="flex-1 flex flex-col items-center">
          <Plane className="text-primary rotate-45" size={14} />
          <p className="text-[10px] xs:text-xs text-muted-foreground mt-1">{ticket.duration}</p>
        </div>
        
        <div className="text-center flex-1 min-w-0">
          <p className="text-base xs:text-xl font-bold text-foreground">{ticket.to.code}</p>
          <p className="text-[10px] xs:text-xs text-muted-foreground truncate">{ticket.to.city}</p>
        </div>
      </div>

      <p className="hidden xs:block text-[10px] xs:text-xs text-muted-foreground text-center mb-2 xs:mb-3 truncate">
        {ticket.from.city}, {ticket.from.country} → {ticket.to.city}, {ticket.to.country}
      </p>

      <div className="flex justify-between items-center gap-1 xs:gap-2 mb-3 xs:mb-4 text-[10px] xs:text-xs text-muted-foreground">
  <span className="whitespace-nowrap">
    {new Date(ticket.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </span>
  <span className="text-center truncate min-w-0 flex-1">
    {getStopsText(ticket.stops)}
  </span>
  <span className="whitespace-nowrap">
    {new Date(ticket.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </span>
</div>
      <div className="mt-2">
      <p className="text-sm xs:text-base sm:text-lg font-bold text-primary">
        {ticket.price.toLocaleString()} ₽
      </p>
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full mt-2 px-3 xs:px-4 py-1.5 xs:py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-xs xs:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? t('adding') : added ? t('added') : t('add_to_cart')}
      </button>
    </div>
      </div>
  )
}