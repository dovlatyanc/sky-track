import { Dot, Plane } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import Map, { Layer, type MapRef, Marker, Source } from 'react-map-gl/maplibre'

import { useCurrentFlight } from '@/hooks/useCurrentFlight'

import { useTheme } from '@/providers/theme/useTheme'

import { FLIGHTS } from '../flight-list/flights.data'

import {
	createSplitGreatCircle,
	dashedStyle,
	solidStyle
} from './sky-track-map.utils'

import 'maplibre-gl/dist/maplibre-gl.css'

export function SkyTrackMap() {
	// TODO: REFACTOR
	const { flight } = useCurrentFlight()

	const currentOtherFlightCoordinates = useMemo(
		() =>
			FLIGHTS.filter(f => f.id !== flight?.id).map(
				f => f.currentLocation.coordinates
			),
		[flight]
	)

	const ref = useRef<MapRef>(null)

	useEffect(() => {
		if (ref.current && flight) {
			ref.current.setCenter({
				lat: flight.currentLocation.coordinates[0],
				lng: flight.currentLocation.coordinates[1]
			})

			// TODO: Flyto animation
			/* 	ref.current.flyTo({
				center: [
					flight.currentLocation.coordinates[1], // longitude
					flight.currentLocation.coordinates[0] // latitude
				],

				duration: 2000
			}) */

			ref.current.setZoom(5)
		}
	}, [flight])

	const [solidCoords, dashedCoords] = useMemo(() => {
		if (!flight?.from || !flight?.to || !flight.currentLocation) return [[], []]

		const all = [
			[flight.from.coordinates[1], flight.from.coordinates[0]],
			[
				flight.currentLocation.coordinates[1],
				flight.currentLocation.coordinates[0]
			],
			[flight.to.coordinates[1], flight.to.coordinates[0]]
		]

		return [all.slice(0, 2), all.slice(1)]
	}, [flight])

	const { solidFeature, dashedFeature, snappedPoint, bearing } = useMemo(() => {
		if (!flight?.from || !flight?.to || !flight?.currentLocation)
			return {
				solidFeature: null,
				dashedFeature: null,
				snappedPoint: null,
				bearing: 0
			}

		const from: [number, number] = [
			flight.from.coordinates[1],
			flight.from.coordinates[0]
		]
		const to: [number, number] = [
			flight.to.coordinates[1],
			flight.to.coordinates[0]
		]
		const current: [number, number] = [
			flight.currentLocation.coordinates[1],
			flight.currentLocation.coordinates[0]
		]

		return createSplitGreatCircle(from, to, current)
	}, [flight])

	const { theme } = useTheme()

	return (
		<Map
			ref={ref}
			initialViewState={{
				latitude: flight?.currentLocation.coordinates[0] || 37.8,
				longitude: flight?.currentLocation.coordinates[1] || -122.4,
				zoom: 5
			}}
			style={{ width: '100%', height: '100vh' }}
			mapStyle={
				theme === 'dark'
					? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
					: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
			}
		>
			{solidCoords.length > 1 && solidFeature && (
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

			{dashedCoords.length > 1 && dashedFeature && (
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

			{snappedPoint && (
				<Marker latitude={snappedPoint[1]} longitude={snappedPoint[0]}>
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

			{flight?.from.coordinates?.length &&
				flight.from.coordinates.length > 1 && (
					<Marker
						latitude={flight?.from.coordinates[0]}
						longitude={flight?.from.coordinates[1]}
					>
						<Dot size={30} className='text-rose-500' />
					</Marker>
				)}

			{flight?.to.coordinates?.length && flight.to.coordinates.length > 1 && (
				<Marker
					latitude={flight?.to.coordinates[0]}
					longitude={flight?.to.coordinates[1]}
				>
					<Dot size={30} className='text-orange-400' />
				</Marker>
			)}

			{!!currentOtherFlightCoordinates.length &&
				currentOtherFlightCoordinates.map(coordinate => (
					<Marker
						key={coordinate.join(',')}
						latitude={coordinate[0]}
						longitude={coordinate[1]}
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
