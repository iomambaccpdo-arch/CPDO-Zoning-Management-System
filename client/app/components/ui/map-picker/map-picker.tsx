"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default leaflet marker icons in React (due to bundler issues)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface MapPickerProps {
    initialLat?: number
    initialLng?: number
    onSelect: (lat: number, lng: number) => void
}

function LocationMarker({ onSelect, initialLat, initialLng }: MapPickerProps) {
    const [position, setPosition] = React.useState<L.LatLng | null>(
        initialLat && initialLng ? new L.LatLng(initialLat, initialLng) : null
    )

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng)
            onSelect(e.latlng.lat, e.latlng.lng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position}></Marker>
    )
}

export default function MapPicker({ initialLat, initialLng, onSelect }: MapPickerProps) {
    // Default center to Panabo City, Mindanao if no initial coordinates are provided
    const defaultCenter: [number, number] = [7.3042, 125.6873]
    const center: [number, number] = initialLat && initialLng ? [initialLat, initialLng] : defaultCenter

    return (
        <MapContainer
            center={center}
            zoom={initialLat && initialLng ? 13 : 12}
            style={{ height: "100%", width: "100%" }}
            className="rounded-md border h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onSelect={onSelect} initialLat={initialLat} initialLng={initialLng} />
        </MapContainer>
    )
}
