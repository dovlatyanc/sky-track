import { CenterLayout } from '@/components/CenterLayout'
import { Heading } from '@/components/custom-ui/Heading'
import { trpc } from '@/lib/trpc'
import { TicketCard } from '../../components/tickets/TicketCard'

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

export function Shop() {
	const {  data:tickets, isLoading } = trpc.tickets.getAll.useQuery()

	if (isLoading) {
		return <div>Loading tickets...</div>
	}

	const handleAddToCart = (ticket: Ticket) => {
		// Пока просто выводим в консоль
		console.log('Added to cart:', ticket)
	}

	return (
		<CenterLayout>
			<div className='mx-auto w-4/5 px-4'>
				<Heading>Flight Shop</Heading>
				<div className="max-h-[70vh] overflow-y-auto pr-2">
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"> 
						{tickets?.map((ticket: Ticket) => (
							<TicketCard
								key={ticket.id}
								ticket={ticket}
								onAddToCart={handleAddToCart}
							/>
						))}
					</div>
				</div>
			</div>
		</CenterLayout>
	)
}