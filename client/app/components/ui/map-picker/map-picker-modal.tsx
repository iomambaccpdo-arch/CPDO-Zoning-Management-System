"use client"

import * as React from "react"
import { MapPin } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "~/components/ui/dialog"
import { Skeleton } from "~/components/ui/skeleton"

// Lazily import the Map component to avoid window-dependent initial render issues in certain bundlers
const MapWithNoSSR = React.lazy(() => import("./map-picker"))

interface MapPickerModalProps {
    open: boolean
    onClose: () => void
    onConfirm: (coordinates: string) => void
    initialCoordinates?: string // Format: "lat, lng"
}

export function MapPickerModal({ open, onClose, onConfirm, initialCoordinates }: MapPickerModalProps) {
    const [selectedCoords, setSelectedCoords] = React.useState<{ lat: number, lng: number } | null>(null)

    // Parse initial coordinates if provided
    let initialLat: number | undefined
    let initialLng: number | undefined
    if (initialCoordinates) {
        const parts = initialCoordinates.split(",").map(s => s.trim())
        if (parts.length === 2) {
            const lat = parseFloat(parts[0])
            const lng = parseFloat(parts[1])
            if (!isNaN(lat) && !isNaN(lng)) {
                initialLat = lat
                initialLng = lng
            }
        }
    }

    React.useEffect(() => {
        if (open) {
            setSelectedCoords(
                initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
            )
        }
    }, [open, initialLat, initialLng])

    const handleConfirm = () => {
        if (selectedCoords) {
            onConfirm(`${selectedCoords.lat.toFixed(6)}, ${selectedCoords.lng.toFixed(6)}`)
        }
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0">
                <div className="p-6 pb-2 border-b shrink-0">
                    <DialogHeader>
                        <DialogTitle>Select Geographic Coordinates</DialogTitle>
                        <DialogDescription>
                            Click on the map to place a pin and select coordinates.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex-1 min-h-0 bg-zinc-50 relative p-4">
                    <React.Suspense fallback={<Skeleton className="w-full h-full rounded-md" />}>
                        <MapWithNoSSR
                            initialLat={initialLat}
                            initialLng={initialLng}
                            onSelect={(lat: number, lng: number) => setSelectedCoords({ lat, lng })}
                        />
                    </React.Suspense>
                </div>

                <DialogFooter className="p-4 border-t shrink-0 flex items-center justify-between sm:justify-between w-full">
                    <div className="text-sm font-mono text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedCoords
                            ? `${selectedCoords.lat.toFixed(6)}, ${selectedCoords.lng.toFixed(6)}`
                            : "No location selected"
                        }
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!selectedCoords}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Confirm Selection
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
