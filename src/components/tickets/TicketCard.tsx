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
    <div className="relative border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 bg-card text-card-foreground">
      <div className="absolute top-3 right-3">
        <TicketFavoriteButton ticketId={ticket.id} size={20} />
      </div>

      <div className="mb-3 pr-8">
        <p className="text-sm font-semibold text-foreground truncate">{ticket.airline}</p>
        <p className="text-xs text-muted-foreground">{ticket.flightNumber}</p>
      </div>

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="text-center flex-1">
          <p className="text-xl font-bold text-foreground">{ticket.from.code}</p>
          <p className="text-xs text-muted-foreground truncate">{ticket.from.city}</p>
        </div>
        
        <div className="flex-1 flex flex-col items-center">
          <Plane className="text-primary rotate-45" size={16} />
          <p className="text-xs text-muted-foreground mt-1">{ticket.duration}</p>
        </div>
        
        <div className="text-center flex-1">
          <p className="text-xl font-bold text-foreground">{ticket.to.code}</p>
          <p className="text-xs text-muted-foreground truncate">{ticket.to.city}</p>
        </div>
      </div>

      <p className="hidden sm:block text-xs text-muted-foreground text-center mb-3 truncate">
        {ticket.from.city}, {ticket.from.country} → {ticket.to.city}, {ticket.to.country}
      </p>

      <div className="flex justify-between items-center gap-2 mb-4 text-xs text-muted-foreground">
        <span>
          {new Date(ticket.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-center">
          {getStopsText(ticket.stops)}
        </span>
        <span>
          {new Date(ticket.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 mt-2">
        <p className="text-xl font-bold text-primary">
          {ticket.price.toLocaleString()} ₽
        </p>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? t('adding') : added ? t('added') : t('add_to_cart')}
        </button>
      </div>
    </div>
  )
}