import { Plane, Clock, MapPin, Navigation, Calendar, Route } from 'lucide-react'
import { SquareArrowOutUpRight } from '@/components/animate-ui/icons/square-arrow-out-up-right'
import { MapPin as MapPinIcon } from '@/components/animate-ui/icons/map-pin'
import { X } from '@/components/animate-ui/icons/x'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { toggleFlightRoute, toggleFollowFlight } from '@/store/flight-actions/flight-action.slice'
import { formatICSDate } from '@/utils/format-ics-date.util'
import { QUERY_PARAM_FLIGHT } from '../flight-list/flights.constants'
import { cn } from '@/lib/utils'
import type { TFlight } from '@/lib/trpc'
import { FlightImage } from './FlightImage'

interface Props {
	flight: NonNullable<TFlight>
	onClose?: () => void
}

export function MobileFlightDetails({ flight, onClose }: Props) {
	const { t } = useTranslation('flightActions')
	const dispatch = useAppDispatch()
	const isShowRoute = useAppSelector(state => state.flightActions.isShowRoute)
	const isFollowingFlight = useAppSelector(state => state.flightActions.isFollowingFlight)

	// Безопасное получение времени
	const getDepartureTime = () => {
		const dep = flight.schedule?.departure?.scheduled
		if (!dep) return '--:--'
		const timeStr = typeof dep === 'string' ? dep : dep.iso || dep.localTime
		return new Date(timeStr).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const getArrivalTime = () => {
		const arr = flight.schedule?.arrival?.scheduled
		if (!arr) return '--:--'
		const timeStr = typeof arr === 'string' ? arr : arr.iso || arr.localTime
		return new Date(timeStr).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const handleShare = async () => {
		try {
			const url = `${window.location.origin}${window.location.pathname}?${QUERY_PARAM_FLIGHT}=${flight.id}`
			await navigator.clipboard.writeText(url)
			toast.success(t('flight_link_copied'), {
				description: t('share_with_friends'),
				id: 'copy-flight-link-success'
			})
		} catch {
			toast.error(t('copy_failed'), {
				description: t('try_again'),
				id: 'copy-flight-link-error'
			})
		}
	}

	const handleAddToCalendar = () => {
		if (!flight) {
			toast.error(t('flight_time_unavailable'))
			return
		}

		const schedule = flight.schedule
		const start = new Date(schedule.departure.scheduled.iso)
		const end = new Date(schedule.arrival.scheduled.iso)

		const dtStart = formatICSDate(start)
		const dtEnd = formatICSDate(end)

		const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Flight ${flight.from.code} → ${flight.to.code} (${flight.id})
DTSTART:${dtStart}
DTEND:${dtEnd}
DESCRIPTION:Airline: ${flight.airline.name}, Flight ID: ${flight.id}
LOCATION:${flight.from.city} - ${flight.to.city}
END:VEVENT
END:VCALENDAR
`.trim()

		const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `flight-${flight.id}.ics`
		link.click()
		URL.revokeObjectURL(url)

		toast.success(t('file_added_to_downloads'), {
			description: t('open_with_calendar')
		})
	}

	const handleCardClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose?.()
		}
	}

	return (
		<div 
			className="relative bg-card/90 backdrop-blur-sm rounded-2xl shadow-xl border border-border overflow-hidden"
			onClick={handleCardClick}
		>
			{/* Картинка самолёта */}
			<FlightImage flight={flight} />

			{/* Крестик закрытия (поверх картинки) */}
			<button
				onClick={onClose}
				className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
				aria-label="Закрыть"
			>
				<X animateOnHover animateOnTap size={18} />
			</button>

			{/* Контент с отступами */}
			<div className="p-4 pt-3">
				{/* Авиакомпания и номер рейса */}
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<img
							src={flight.assets.logo}
							alt={flight.airline.name}
							className="w-8 h-8 rounded-full bg-white object-contain"
						/>
						<span className="text-sm font-semibold text-foreground">
							{flight.airline.name}
						</span>
					</div>
					<span className="text-xs text-muted-foreground">
						{flight.id}
					</span>
				</div>

				{/* Маршрут */}
				<div className="flex items-center justify-between gap-2 mb-3">
					<div className="text-center flex-1">
						<p className="text-2xl font-bold text-foreground">
							{flight.from.code}
						</p>
						<p className="text-xs text-muted-foreground truncate max-w-[60px]">
							{flight.from.city || '—'}
						</p>
					</div>

					<div className="flex flex-col items-center flex-1">
						<Plane className="text-primary rotate-45" size={16} />
						<div className="w-full h-px bg-border my-1" />
						<span className="text-[10px] text-muted-foreground">
							{flight.progress}%
						</span>
					</div>

					<div className="text-center flex-1">
						<p className="text-2xl font-bold text-foreground">
							{flight.to.code}
						</p>
						<p className="text-xs text-muted-foreground truncate max-w-[60px]">
							{flight.to.city || '—'}
						</p>
					</div>
				</div>

				{/* Время, скорость/высота */}
				<div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
					<div className="flex items-center gap-1">
						<Clock size={14} />
						<span>{getDepartureTime()}</span>
					</div>

					<div className="flex items-center gap-2">
						{flight.route?.speed && (
							<span className="flex items-center gap-0.5">
								<Navigation size={12} />
								{Math.round(flight.route.speed)} км/ч
							</span>
						)}
						{flight.route?.altitude && (
							<span className="text-[10px]">
								{Math.round(flight.route.altitude)} м
							</span>
						)}
					</div>

					<div className="flex items-center gap-1">
						<MapPin size={14} />
						<span>{getArrivalTime()}</span>
					</div>
				</div>

				{/* Прогресс-бар */}
				<div className="mt-3 w-full h-1 bg-muted rounded-full overflow-hidden">
					<div 
						className="h-full bg-primary transition-all duration-500"
						style={{ width: `${Math.min(flight.progress, 100)}%` }}
					/>
				</div>

				{/* 4 кнопки */}
				<div className="grid grid-cols-4 gap-1 mt-4 pt-3 border-t border-border">
					<button
						onClick={() => dispatch(toggleFlightRoute())}
						className={cn(
							'p-3 rounded-xl bg-card hover:bg-card/60 flex items-center justify-center transition-colors',
							isShowRoute && 'bg-[#ddd] dark:bg-[#282828]'
						)}
						aria-label={t('route')}
					>
						<Route size={20} />
					</button>

					<button
						onClick={() => dispatch(toggleFollowFlight())}
						className={cn(
							'p-3 rounded-xl bg-card hover:bg-card/60 flex items-center justify-center transition-colors',
							isFollowingFlight && 'bg-[#ddd] dark:bg-[#282828]'
						)}
						aria-label={t('follow')}
					>
						<MapPinIcon size={20} />
					</button>

					<button
						onClick={handleShare}
						className="p-3 rounded-xl bg-card hover:bg-card/60 flex items-center justify-center transition-colors"
						aria-label={t('share')}
					>
						<SquareArrowOutUpRight size={20} />
					</button>

					<button
						onClick={handleAddToCalendar}
						className="p-3 rounded-xl bg-card hover:bg-card/60 flex items-center justify-center transition-colors"
						aria-label={t('add')}
					>
						<Calendar size={20} />
					</button>
				</div>
			</div>
		</div>
	)
}