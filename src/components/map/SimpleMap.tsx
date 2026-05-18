import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'



import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface Location {
  lat: number
  lng: number
  title?: string
  description?: string
}

interface SimpleMapProps {
  center?: [number, number]
  zoom?: number
  markers?: Location[]
  height?: string
}

export function SimpleMap({
  center = [55.751244, 37.618423], // Москва по умолчанию
  zoom = 10,
  markers = [],
  height = '400px'
}: SimpleMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '0.75rem' }}
      className="z-0"
    >
      {/* Базовый слой карты — OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Маркеры на карте */}
      {markers.map((marker, idx) => (
        <Marker key={idx} position={[marker.lat, marker.lng]}>
          <Popup>
            {marker.title && <strong>{marker.title}</strong>}
            {marker.description && <div className="text-sm mt-1">{marker.description}</div>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}