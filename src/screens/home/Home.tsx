import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

import { FlightDetails } from '@/components/flight-details/FlightDetails'
import { FlightList } from '@/components/flight-list/FlightList'
import { SkyTrackMap } from '@/components/map/SkyTrackMap'

import { trpc } from '@/lib/trpc'

export function Home() {
	const lastUpdateRef = useRef<Date | null>(new Date())

	const [currentAirline, setCurrentAirline] = useState<string | undefined>(
		undefined
	)
	const [fromCountry, setFromCountry] = useState<string | undefined>(undefined)
	const [isMobileListOpen, setIsMobileListOpen] = useState(true)
	const [isMobile, setIsMobile] = useState(false)

	const {
		data,
		isLoading,
		error,
		refetch,
		isRefetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = trpc.flights.getLive.useInfiniteQuery(
		{
			limit: 10,
			airlineName: currentAirline
		},
		{
			getNextPageParam: lastPage => {
				return lastPage.nextCursor
			},
			select: data => {
				return data.pages.flatMap(page => page.items) ?? []
			}
		}
	)

	useEffect(() => {
		const interval = setInterval(() => {
			// refetch()
		}, 10000)

		return () => clearInterval(interval)
	}, [refetch])

	useEffect(() => {
		if (data && data.length > 0) {
			lastUpdateRef.current = new Date()
		}
	}, [data])

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	const filteredData = useMemo(
		() =>
			data
				?.filter(f => !!f)
				.filter(flight => {
					if (currentAirline && flight?.airline.name !== currentAirline) {
						return false
					}
					if (fromCountry && flight?.from.countryName !== fromCountry) {
						return false
					}
					return true
				}),
		[currentAirline, data, fromCountry]
	)

	const [searchParams] = useSearchParams()
	const selectedFlight = searchParams.get('flight')

	const activeFlight = useMemo(
		() => data?.find(flight => flight?.id === selectedFlight),
		[data, selectedFlight]
	)

	// Закрываем список на мобилке при выборе рейса
	useEffect(() => {
		if (isMobile && activeFlight) {
			setIsMobileListOpen(false)
		}
	}, [activeFlight, isMobile])

	return error ? (
		<div className="p-4 text-red-500">
			Error fetching live flights: {error.message}
		</div>
	) : (
		<div className="relative min-h-screen">
			{/* Карта на весь экран задним фоном */}
			<div className='fixed inset-0 z-0'>
				<SkyTrackMap flights={filteredData || []} activeFlight={activeFlight} />
			</div>
			
			{/* Кнопка-бургер для мобильных устройств */}
			{isMobile && !isMobileListOpen && (
				<button
					onClick={() => setIsMobileListOpen(true)}
					className="fixed top-20 left-4 z-20 bg-card border border-border rounded-lg p-3 shadow-lg hover:bg-muted transition-all duration-200 backdrop-blur-sm"
					aria-label="Open flight list"
				>
					<svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			)}

			{/* Закрывающий оверлей для мобильного списка */}
			{isMobile && isMobileListOpen && (
				<div 
					className="fixed inset-0 z-15 bg-black/50 transition-opacity duration-300"
					onClick={() => setIsMobileListOpen(false)}
				/>
			)}

			{/* FlightList - адаптивная версия */}
			<div className={`
				fixed left-0 top-0 z-20 h-screen transition-all duration-300 ease-in-out
				${isMobile 
					? `w-[85vw] max-w-[20rem] ${isMobileListOpen ? 'translate-x-0' : '-translate-x-full'}`
					: 'w-[min(90vw,28rem)] lg:w-[32rem] xl:w-[36rem]'
				}
				pt-20 px-2 sm:px-4
			`}>
				<div className="relative h-full">
					{/* Кнопка закрытия для мобильной версии */}
					{isMobile && isMobileListOpen && (
						<button
							onClick={() => setIsMobileListOpen(false)}
							className="absolute -right-12 top-24 z-30 bg-card border border-border rounded-lg p-2 shadow-lg hover:bg-muted transition-colors backdrop-blur-sm"
							aria-label="Close flight list"
						>
							<svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					)}
					<FlightList
						flights={filteredData || []}
						lastUpdate={lastUpdateRef.current}
						isRefetching={isRefetching}
						isPending={isLoading}
						refetch={refetch}
						currentAirline={currentAirline}
						setCurrentAirline={setCurrentAirline}
						fromCountry={fromCountry}
						setFromCountry={setFromCountry}
						fetchNextPage={fetchNextPage}
						hasNextPage={hasNextPage}
						isFetchingNextPage={isFetchingNextPage}
					/>
				</div>
			</div>

			{/* FlightDetails - адаптивная версия */}
			{activeFlight && (
				<div className={`
					fixed right-0 top-0 z-20 h-screen transition-all duration-300 ease-in-out
					${isMobile 
						? 'w-[85vw] max-w-[20rem] translate-x-0'
						: 'w-[min(90vw,28rem)] lg:w-[32rem] xl:w-[36rem]'
					}
				`}>
					<div className="relative h-full">
						{isMobile && (
							<button
								onClick={() => {
									window.history.pushState({}, '', window.location.pathname)
									setIsMobileListOpen(true)
								}}
								className="absolute -left-12 top-24 z-30 bg-card border border-border rounded-lg p-2 shadow-lg hover:bg-muted transition-colors backdrop-blur-sm"
								aria-label="Close flight details"
							>
								<svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
							</button>
						)}
						<FlightDetails flight={activeFlight} />
					</div>
				</div>
			)}
		</div>
	)
}