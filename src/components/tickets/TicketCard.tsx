import { Plane } from 'lucide-react'

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
		<div className="border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 bg-card text-card-foreground min-h-[240px]"> 
			<div className="flex justify-between items-start">
				<div>
					<div className="flex items-center gap-3">
						<span className="font-bold text-2xl">{ticket.from.code}</span> 
						<div className="flex items-center gap-2">
							<Plane className="text-blue-500 rotate-45" size={24} /> 
							<span className="text-base text-muted-foreground">{ticket.duration}</span> 
						</div>
						<span className="font-bold text-2xl">{ticket.to.code}</span>
					</div>
					<p className="text-lg text-muted-foreground mt-1"> 
						{ticket.from.city}, {ticket.from.country} → {ticket.to.city}, {ticket.to.country}
					</p>
				</div>
				<div className="text-right">
					<p className="text-4xl font-bold text-primary">{ticket.price} RUB</p> 
					<p className="text-base text-muted-foreground">{ticket.airline} · {ticket.flightNumber}</p> 
				</div>
			</div>

			<div className="mt-4 flex justify-between text-lg">
				<div>
					<p className="font-medium">{new Date(ticket.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
					<p className="text-sm text-muted-foreground">{new Date(ticket.departureTime).toLocaleDateString()}</p> 
				</div>
				<div className="text-center">
					<p className="text-muted-foreground">{ticket.stops === 0 ? 'Direct' : `${ticket.stops} stop${ticket.stops > 1 ? 's' : ''}`}</p>
				</div>
				<div className="text-right">
					<p className="font-medium">{new Date(ticket.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
					<p className="text-sm text-muted-foreground">{new Date(ticket.arrivalTime).toLocaleDateString()}</p>
				</div>
			</div>

			<button
				onClick={() => onAddToCart(ticket)}
				className="mt-5 w-full bg-primary
                 hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors text-xl" 
			>
				Add to Cart
			</button>
		</div>
	)
}