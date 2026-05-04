import { Plane } from 'lucide-react'
import { TicketFavoriteButton } from './TicketFavoriteButton'
import { useCart } from '@/hooks/useCart'

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
  onAddToCart?: (ticket: Ticket) => void  // сделали опциональным
}

export function TicketCard({ ticket, onAddToCart }: Props) {
  const { addToCart, isAdding } = useCart()
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(ticket)
    } else {
      addToCart(ticket.id)
    }
  }
  
  return (
    <div className="relative border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 bg-card text-card-foreground">
      {/* Кнопка избранного - в правом верхнем углу */}
      <div className="absolute top-3 right-3">
        <TicketFavoriteButton ticketId={ticket.id} size={20} />
      </div>

      {/* Авиакомпания */}
      <div className="mb-3 pr-8">
        <p className="text-sm font-semibold text-foreground truncate">{ticket.airline}</p>
        <p className="text-xs text-muted-foreground">{ticket.flightNumber}</p>
      </div>

      {/* Маршрут */}
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

      {/* Полное название городов (только на десктопе) */}
      <p className="hidden sm:block text-xs text-muted-foreground text-center mb-3 truncate">
        {ticket.from.city}, {ticket.from.country} → {ticket.to.city}, {ticket.to.country}
      </p>

      {/* Время и пересадки */}
      <div className="flex justify-between items-center gap-2 mb-4 text-xs text-muted-foreground">
        <span>
          {new Date(ticket.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-center">
          {ticket.stops === 0 ? 'Direct' : `${ticket.stops} stop${ticket.stops > 1 ? 's' : ''}`}
        </span>
        <span>
          {new Date(ticket.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Цена и кнопка */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <p className="text-xl font-bold text-primary">
          {ticket.price.toLocaleString()} ₽
        </p>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? 'Adding...' : 'Buy'}
        </button>
      </div>
    </div>
  )
}