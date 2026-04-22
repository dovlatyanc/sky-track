import type { TRouterOutput } from 'backend/src/trpc'
import { Dot, Plane } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import Map, { Layer, type MapRef, Marker, Source } from 'react-map-gl/maplibre'

import { useAppSelector } from '@/hooks/useAppSelector'

import type { TFlight } from '@/lib/trpc'

import { useTheme } from '@/providers/theme/useTheme'

import {
	createSplitGreatCircle,
	dashedStyle,
	solidStyle
} from './sky-track-map.utils'

import 'maplibre-gl/dist/maplibre-gl.css'

interface Props {
	flights: TRouterOutput['flights']['getLive']
	activeFlight: TFlight | null | undefined
}

export function SkyTrackMap({ flights, activeFlight }: Props) {
	const otherFlightCoordinates = useMemo(
		() =>
			flights
				.filter(
					flight =>
						flight?.id !== activeFlight?.id &&
						!!flight?.currentLocation.coordinates
				)
				.filter(flight => !!flight)
				.map(flight => ({
					flightId: flight.id,
					coord: flight.currentLocation.coordinates!
				})),
		[activeFlight?.id, flights]
	)

	const ref = useRef<MapRef>(null)

	const activeFlightCoordinates = activeFlight?.currentLocation.coordinates
	const fromCoordinates = activeFlight?.from.coordinates
	const toCoordinates = activeFlight?.to.coordinates

	useEffect(() => {
		if (
			ref.current &&
			activeFlight &&
			activeFlightCoordinates?.lat &&
			activeFlightCoordinates?.lng
		) {
			ref.current.setCenter({
				lat: activeFlightCoordinates?.lat,
				lng: activeFlightCoordinates?.lng
			})

			// TODO: Flyto animation
			/* 	ref.current.flyTo({
				center: [
					flight.currentLocation.coordinates[1], // lat
					flight.currentLocation.coordinates[0] // lng
				],

				duration: 2000
			}) */

			ref.current.setZoom(5)
		}
	}, [activeFlight, activeFlightCoordinates?.lat, activeFlightCoordinates?.lng])

	const [solidCoords, dashedCoords] = useMemo(() => {
		if (!activeFlightCoordinates?.lat || !activeFlightCoordinates.lng)
			return [[], []]

		const all = [
			[fromCoordinates?.lng, fromCoordinates?.lat],
			[activeFlightCoordinates.lat, activeFlightCoordinates.lng],
			[toCoordinates?.lng, toCoordinates?.lat]
		]

		return [all.slice(0, 2), all.slice(1)]
	}, [
		toCoordinates?.lat,
		toCoordinates?.lng,
		fromCoordinates?.lat,
		fromCoordinates?.lng,
		activeFlightCoordinates?.lng,
		activeFlightCoordinates?.lat
	])

	const { solidFeature, dashedFeature, snappedPoint, bearing } = useMemo(() => {
		if (!activeFlightCoordinates?.lng || !activeFlightCoordinates?.lat)
			return {
				solidFeature: null,
				dashedFeature: null,
				snappedPoint: null,
				bearing: 0
			}

		if (!fromCoordinates || !toCoordinates) {
			return {
				solidFeature: null,
				dashedFeature: null,
				snappedPoint: null,
				bearing: 0
			}
		}

		const from: [number, number] = [fromCoordinates?.lng, fromCoordinates?.lat]
		const to: [number, number] = [toCoordinates?.lng, toCoordinates?.lat]
		const current: [number, number] = [
			activeFlightCoordinates.lng,
			activeFlightCoordinates.lat
		]

		return createSplitGreatCircle(from, to, current)
	}, [
		toCoordinates,
		fromCoordinates,
		activeFlightCoordinates?.lng,
		activeFlightCoordinates?.lat
	])

	const { theme } = useTheme()

	const isShowRoute = useAppSelector(state => state.flightActions.isShowRoute)

	return (
		<Map
			ref={ref}
			initialViewState={{
				longitude: activeFlightCoordinates?.lng || 82,
				latitude: activeFlightCoordinates?.lat || 25,
				zoom: 2
			}}
			style={{ width: '100%', height: '100vh' }}
			mapStyle={
				theme === 'dark'
					? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
					: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
			}
		>
			{solidCoords.length > 1 && solidFeature && isShowRoute && (
				<Source
					id='route-solid'
					type='geojson'
					data={{
						type: 'FeatureCollection',
						features: [solidFeature]
					}}
				>
					<Layer {...solidStyle(theme)} />
				</Source>
			)}

			{dashedCoords.length > 1 && dashedFeature && isShowRoute && (
				<Source
					id='route-dashed'
					type='geojson'
					data={{
						type: 'FeatureCollection',
						features: [dashedFeature]
					}}
				>
					<Layer {...dashedStyle(theme)} />
				</Source>
			)}

			{activeFlightCoordinates && (
				<>
					{snappedPoint && (
						<Marker longitude={snappedPoint[0]} latitude={snappedPoint[1]}>
							<div
								style={{
									transform: `rotate(${bearing - 45}deg)`,
									transformOrigin: 'center',
									transition: 'transform 0.3s ease'
								}}
							>
								<Plane strokeWidth={0} size={28} className='fill-foreground' />
							</div>
						</Marker>
					)}

					{fromCoordinates && (
						<Marker
							longitude={fromCoordinates.lng}
							latitude={fromCoordinates.lat}
						>
							<Dot size={30} className='text-rose-500' />
						</Marker>
					)}

					{toCoordinates && (
						<Marker longitude={toCoordinates.lng} latitude={toCoordinates.lat}>
							<Dot size={30} className='text-orange-400' />
						</Marker>
					)}
				</>
			)}

			{!!otherFlightCoordinates.length &&
				otherFlightCoordinates.map(coordinate => (
					<Marker
						key={coordinate.flightId}
						longitude={coordinate.coord?.lng}
						latitude={coordinate.coord?.lat}
					>
						<Plane
							strokeWidth={0}
							size={20}
							className={'fill-foreground opacity-30'}
						/>
					</Marker>
				))}
		</Map>
	)
}
