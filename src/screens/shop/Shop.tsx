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
	const { data: tickets, isLoading } = trpc.tickets.getAll.useQuery()

	if (isLoading) {
		return (
			<CenterLayout>
				<div className="flex justify-center items-center min-h-[50vh]">
					<div className="text-lg">Loading tickets...</div>
				</div>
			</CenterLayout>
		)
	}

	const handleAddToCart = (ticket: Ticket) => {
		console.log('Added to cart:', ticket)
	}

	return (
		<CenterLayout>
			<div className="w-full px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
				<Heading>Flight Shop</Heading>
				<div className="max-h-[70vh] overflow-y-auto pr-1 xs:pr-2">
					<div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 desktop:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
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