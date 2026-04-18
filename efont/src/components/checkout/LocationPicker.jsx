import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MdMyLocation } from 'react-icons/md';
import { FaTimes } from 'react-icons/fa';

// Fix leaflet default marker icon broken by vite asset bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Smoothly flies to the selected position whenever it changes
const FlyToLocation = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15);
        }
    }, [position, map]);
    return null;
};

// Handles map click — reverse geocodes with Nominatim, passes full response up
const LocationMarker = ({ position, onSelect }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            )
                .then((res) => res.json())
                .then((data) => onSelect(lat, lng, data))
                .catch(() => onSelect(lat, lng, null));
        },
    });
    return position ? <Marker position={position} /> : null;
};

// Extracts the fields we care about from a Nominatim reverse-geocode response
const extractComponents = (data) => ({
    city:
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        '',
    state: data?.address?.state || '',
    pincode: data?.address?.postcode || '',
    street: data?.address?.road || data?.address?.suburb || '',
    country: data?.address?.country || '',
    mapAddress: data?.display_name || '',
});

const LocationPicker = ({ onLocationSelect, mapHeight = 280, buttonStyle = {}, successBoxStyle = {} }) => {
    const [position, setPosition] = useState(null);
    const [mapAddress, setMapAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [gpsError, setGpsError] = useState('');

    // Default map center — Kathmandu, Nepal
    const defaultCenter = [27.7172, 85.324];

    const handleSelect = (lat, lng, nominatimData) => {
        const components = extractComponents(nominatimData);
        setPosition([lat, lng]);
        setMapAddress(components.mapAddress);
        onLocationSelect({
            latitude: lat,
            longitude: lng,
            ...components,
        });
    };

    const handleClear = () => {
        setPosition(null);
        setMapAddress('');
        setGpsError('');
        onLocationSelect(null);
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setGpsError('Geolocation is not supported by your browser.');
            return;
        }
        setGpsError('');
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                )
                    .then((res) => res.json())
                    .then((data) => handleSelect(lat, lng, data))
                    .catch(() => handleSelect(lat, lng, null))
                    .finally(() => setLoading(false));
            },
            (err) => {
                let message;
                if (err.code === 1) {
                    message = 'Location access denied. Allow location permission in your browser settings, then try again.';
                } else if (err.code === 2) {
                    message = 'Your location could not be determined. You may be on a VPN, or location services may be off on your device. Please click on the map instead.';
                } else if (err.code === 3) {
                    message = 'Location request timed out. Please check your connection or click on the map instead.';
                } else {
                    message = 'Could not get your location. Please click on the map instead.';
                }
                setGpsError(message);
                setLoading(false);
            },
            { timeout: 15000, maximumAge: 0, enableHighAccuracy: false }
        );
    };

    return (
        <div className="mt-2">
            <p className="text-sm font-semibold text-slate-800 mb-2">
                Pin Your Location
                <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mb-3">
                <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={loading}
                    className="flex items-center gap-1.5 bg-custom-blue hover:bg-blue-800 disabled:opacity-60 text-white font-semibold rounded-md transition-colors"
                    style={{ padding: '8px 16px', fontSize: '0.875rem', ...buttonStyle }}
                >
                    {loading ? (
                        <>
                            <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Detecting...
                        </>
                    ) : (
                        <>
                            <MdMyLocation className="text-base" />
                            Use My Location
                        </>
                    )}
                </button>

                {position && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-md transition-colors border border-gray-300"
                        style={{ padding: '8px 16px', fontSize: '0.875rem', ...buttonStyle }}
                    >
                        <FaTimes className="text-xs" />
                        Clear Location
                    </button>
                )}
            </div>

            {/* GPS denied / error */}
            {gpsError && (
                <div className="mb-3 px-3 py-2 bg-orange-50 border border-orange-300 rounded-md text-xs text-orange-700">
                    {gpsError}
                </div>
            )}

            {/* Hint when no location yet */}
            {!position && !gpsError && (
                <p className="text-xs text-gray-400 mb-2">
                    Click anywhere on the map to pin your delivery location.
                </p>
            )}

            {/* Map */}
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{
                    height: `${mapHeight}px`,
                    width: '100%',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FlyToLocation position={position} />
                <LocationMarker position={position} onSelect={handleSelect} />
            </MapContainer>

            {/* Success confirmation */}
            {position && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded-md" style={{ padding: '8px 12px', ...successBoxStyle }}>
                    <p className="text-xs font-semibold text-green-800">
                        Location pinned successfully
                    </p>
                    {mapAddress && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{mapAddress}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                        Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
