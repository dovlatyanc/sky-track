import { Dot, Plane } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import Map, { Layer, type MapRef, Marker, Source } from 'react-map-gl/maplibre'

import { useCurrentFlight } from '@/hooks/useCurrentFlight'

import { useTheme } from '@/providers/theme/useTheme'

import { getAirportCoordinatesByICAO } from '../../../backend/src/data/airports/get-airport-coordinates-by-icao'

import {
	createSplitGreatCircle,
	dashedStyle,
	solidStyle
} from './sky-track-map.utils'
import type { IOpenskyState } from '@/services/external/opensky/opensky.types'

import 'maplibre-gl/dist/maplibre-gl.css'

interface Props {
	flights: IOpenskyState[]
}

// Нужно поштучно собирать будет по icao24 UAL2165 и потом кэшировать в массив

export function SkyTrackMap({ flights }: Props) {
	const { flight } = useCurrentFlight()

	console.log(
		'SkyTrackMap flights',
		flights.map(f => f.callsign)
	)

	const currentOtherFlightCoordinates = useMemo(() => {
		return flights
			.filter(f => f.icao24 !== flight?.flight.icao)
			.filter(f => f.latitude !== null && f.longitude !== null)
			.map(f => [f.latitude!, f.longitude!] as [number, number])
	}, [flights, flight])

	const flightAdditionalData = useMemo(() => {
		return flights.find(f => f.callsign === flight?.flight.icao)
	}, [flight?.flight.icao, flights])

	const ref = useRef<MapRef>(null)

	useEffect(() => {
		if (
			ref.current &&
			flightAdditionalData &&
			flightAdditionalData.latitude &&
			flightAdditionalData.longitude
		) {
			ref.current.setCenter({
				lat: flightAdditionalData.latitude,
				lng: flightAdditionalData.longitude
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
	}, [flight, flightAdditionalData])

	const coordinatesDeparture = useMemo(
		() => getAirportCoordinatesByICAO(flight?.departure.icao),
		[flight?.departure.icao]
	)

	const coordinatesArrival = useMemo(
		() => getAirportCoordinatesByICAO(flight?.arrival.icao),
		[flight?.arrival.icao]
	)

	const [solidCoords, dashedCoords] = useMemo(() => {
		if (!flightAdditionalData?.latitude || !flightAdditionalData?.longitude)
			return [[], []]

		const all = [
			[coordinatesDeparture?.lng, coordinatesDeparture?.lat],
			[flightAdditionalData.longitude, flightAdditionalData.latitude],
			[coordinatesArrival?.lng, coordinatesArrival?.lat]
		]

		return [all.slice(0, 2), all.slice(1)]
	}, [
		coordinatesArrival?.lat,
		coordinatesArrival?.lng,
		coordinatesDeparture?.lat,
		coordinatesDeparture?.lng,
		flightAdditionalData?.latitude,
		flightAdditionalData?.longitude
	])

	const { solidFeature, dashedFeature, snappedPoint, bearing } = useMemo(() => {
		if (
			!flight?.departure.icao ||
			!flight?.arrival.icao ||
			!flightAdditionalData?.latitude ||
			!flightAdditionalData?.longitude
		)
			return {
				solidFeature: null,
				dashedFeature: null,
				snappedPoint: null,
				bearing: 0
			}

		if (coordinatesDeparture === null || coordinatesArrival === null) {
			return {
				solidFeature: null,
				dashedFeature: null,
				snappedPoint: null,
				bearing: 0
			}
		}

		const from: [number, number] = [
			coordinatesDeparture?.lng,
			coordinatesDeparture?.lat
		]
		const to: [number, number] = [
			coordinatesArrival?.lng,
			coordinatesArrival?.lat
		]
		const current: [number, number] = [
			flightAdditionalData.longitude,
			flightAdditionalData.latitude
		]

		return createSplitGreatCircle(from, to, current)
	}, [
		coordinatesArrival,
		coordinatesDeparture,
		flight?.arrival.icao,
		flight?.departure.icao,
		flightAdditionalData?.latitude,
		flightAdditionalData?.longitude
	])

	const { theme } = useTheme()

	return (
		<Map
			ref={ref}
			initialViewState={{
				latitude: flightAdditionalData?.latitude || 37.8,
				longitude: flightAdditionalData?.longitude || -122.4,
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

			{coordinatesDeparture && (
				<Marker
					latitude={coordinatesDeparture.lat}
					longitude={coordinatesDeparture.lng}
				>
					<Dot size={30} className='text-rose-500' />
				</Marker>
			)}

			{coordinatesArrival && (
				<Marker
					latitude={coordinatesArrival.lat}
					longitude={coordinatesArrival.lng}
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
