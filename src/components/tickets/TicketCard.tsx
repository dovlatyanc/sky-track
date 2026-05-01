import { Plane } from 'lucide-react'
import { TicketFavoriteButton } from './TicketFavoriteButton'

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
	onAddToCart: (ticket: Ticket) => void
}

export function TicketCard({ ticket, onAddToCart }: Props) {
	return (
		<div className="border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 xs:p-4 sm:p-5 md:p-6 bg-card text-card-foreground h-full flex flex-col">
			{/* Верхняя секция с маршрутом и ценой */}
			<div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4 mb-3 xs:mb-4">
				<div className="flex-1 min-w-0 w-full xs:w-auto">
					<div className="flex flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3">
						<span className="font-bold text-lg xs:text-xl sm:text-2xl md:text-3xl">
							{ticket.from.code}
						</span>
						<div className="flex items-center gap-1 xs:gap-2 flex-shrink-0">
							<Plane className="text-blue-500 rotate-45 flex-shrink-0" size={16} />
							<span className="text-xs xs:text-sm sm:text-base text-muted-foreground whitespace-nowrap">
								{ticket.duration}
							</span>
						</div>
						<span className="font-bold text-lg xs:text-xl sm:text-2xl md:text-3xl">
							{ticket.to.code}
						</span>
					</div>
					<p className="text-xs xs:text-sm sm:text-base text-muted-foreground mt-1 truncate">
						{ticket.from.city}, {ticket.from.country} → {ticket.to.city}, {ticket.to.country}
					</p>
				</div>
				
				<div className="text-left xs:text-right flex-shrink-0 w-full xs:w-auto">
					<p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-primary break-words">
						{ticket.price.toLocaleString()} RUB
					</p>
					<p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground truncate">
						{ticket.airline} · {ticket.flightNumber}
					</p>
				</div>
			</div>

			{/* Секция с временем */}
			<div className="mt-2 flex justify-between items-center gap-1 xs:gap-2 sm:gap-4">
				<div className="min-w-0 flex-1">
					<p className="font-medium text-xs xs:text-sm sm:text-base truncate">
						{new Date(ticket.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</p>
					<p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground truncate">
						{new Date(ticket.departureTime).toLocaleDateString()}
					</p>
				</div>
				
				<div className="flex-shrink-0 px-0.5 xs:px-1 sm:px-2">
					<p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
						{ticket.stops === 0 ? 'Direct' : `${ticket.stops} stop${ticket.stops > 1 ? 's' : ''}`}
					</p>
				</div>
				
				<div className="text-right min-w-0 flex-1">
					<p className="font-medium text-xs xs:text-sm sm:text-base truncate">
						{new Date(ticket.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</p>
					<p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground truncate">
						{new Date(ticket.arrivalTime).toLocaleDateString()}
					</p>
				</div>
			</div>

			{/* Кнопка */}
			<TicketFavoriteButton ticketId={ticket.id} size={18} />
			<button
				onClick={() => onAddToCart(ticket)}
				className="mt-3 xs:mt-4 sm:mt-5 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 xs:py-2.5 sm:py-3 rounded-lg transition-colors text-xs xs:text-sm sm:text-base font-medium"
			>
				Add to Cart
			</button>
		</div>
	)
}