import {
    ArrowLeft,
    MapPin,
    RefreshCw,
} from "lucide-react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import api from "../../services/api";


// ==========================================
// FIX LEAFLET MARKER
// ==========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ==========================================
// MAP CENTER COMPONENT
// ==========================================

const MapCenter = ({
    latitude,
    longitude,
}) => {

    const map =
        useMap();


    useEffect(() => {

        if (
            latitude ===
                undefined ||
            longitude ===
                undefined
        ) {
            return;
        }


        map.setView(
            [
                latitude,
                longitude,
            ],

            map.getZoom()
        );

    }, [
        latitude,
        longitude,
        map,
    ]);


    return null;
};


// ==========================================
// MAIN COMPONENT
// ==========================================

const TrackDelivery = () => {

    const {
        assignmentId,
    } = useParams();


    // ==========================================
    // STATE
    // ==========================================

    const [location, setLocation] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [refreshing, setRefreshing] =
        useState(false);


    // ==========================================
    // LOAD LOCATION
    // ==========================================

    const loadLocation =
        async (
            showLoader = false
        ) => {

            try {

                if (showLoader) {
                    setRefreshing(true);
                }


                setError("");


                const response =
                    await api.get(
                        `/delivery-location/${assignmentId}`
                    );


                const data =
                    response.data?.data ||
                    response.data;


                setLocation(
                    data
                );

            } catch (err) {

                console.error(
                    "Failed to load delivery location:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    "Unable to load delivery location."
                );

            } finally {

                setLoading(false);

                setRefreshing(false);

            }

        };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadLocation();


        const interval =
            setInterval(
                () => {
                    loadLocation();
                },
                5000
            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, [
        assignmentId,
    ]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-50">

                <div className="mx-auto max-w-7xl px-4 py-10">

                    <div className="animate-pulse">

                        <div className="h-10 w-64 rounded bg-gray-200" />

                        <div className="mt-8 h-[600px] rounded-2xl bg-gray-200" />

                    </div>

                </div>

            </div>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* HEADER */}

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                        <Link
                            to="/orders"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Back to Orders

                        </Link>


                        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-500">

                            Delivery Tracking

                        </p>


                        <h1 className="mt-1 text-3xl font-black sm:text-4xl">

                            Live Delivery Location

                        </h1>


                        <p className="mt-2 text-gray-500">

                            Delivery location updates automatically.

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            loadLocation(
                                true
                            )
                        }
                        disabled={
                            refreshing
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                    >

                        <RefreshCw
                            size={18}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <p className="font-bold text-red-700">

                            Tracking Error

                        </p>

                        <p className="mt-1 text-sm text-red-600">

                            {error}

                        </p>

                    </div>

                )}


                {/* LOCATION */}

                {location ? (

                    <div className="mt-8 space-y-6">

                        {/* STATUS */}

                        <div className="rounded-2xl border bg-white p-6">

                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">

                                        <MapPin
                                            size={23}
                                        />

                                    </div>


                                    <div>

                                        <h2 className="font-black">

                                            Delivery Person Location

                                        </h2>


                                        <p className="mt-1 text-sm text-gray-500">

                                            {location.isTracking
                                                ? "Live tracking is active"
                                                : "Tracking is currently stopped"}

                                        </p>

                                    </div>

                                </div>


                                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold">

                                    {location.isTracking
                                        ? "LIVE"
                                        : "OFFLINE"}

                                </div>

                            </div>

                        </div>


                        {/* MAP */}

                        <div className="overflow-hidden rounded-2xl border bg-white">

                            <MapContainer
                                center={[
                                    location.latitude,
                                    location.longitude,
                                ]}
                                zoom={
                                    16
                                }
                                scrollWheelZoom={
                                    true
                                }
                                className="h-[600px] w-full"
                            >

                                <TileLayer
                                    attribution='&copy; OpenStreetMap contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />


                                <Marker
                                    position={[
                                        location.latitude,
                                        location.longitude,
                                    ]}
                                >

                                    <Popup>

                                        <div>

                                            <p className="font-bold">

                                                Delivery Person

                                            </p>


                                            <p className="text-sm">

                                                Current location

                                            </p>

                                        </div>

                                    </Popup>

                                </Marker>


                                <MapCenter
                                    latitude={
                                        location.latitude
                                    }
                                    longitude={
                                        location.longitude
                                    }
                                />

                            </MapContainer>

                        </div>


                        {/* LOCATION DETAILS */}

                        <div className="grid gap-4 sm:grid-cols-3">

                            <div className="rounded-2xl border bg-white p-5">

                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">

                                    Latitude

                                </p>

                                <p className="mt-2 break-all font-mono font-bold">

                                    {location.latitude}

                                </p>

                            </div>


                            <div className="rounded-2xl border bg-white p-5">

                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">

                                    Longitude

                                </p>

                                <p className="mt-2 break-all font-mono font-bold">

                                    {location.longitude}

                                </p>

                            </div>


                            <div className="rounded-2xl border bg-white p-5">

                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">

                                    Accuracy

                                </p>

                                <p className="mt-2 font-bold">

                                    {location.accuracy
                                        ? `${Math.round(location.accuracy)} meters`
                                        : "N/A"}

                                </p>

                            </div>

                        </div>


                        {/* LAST UPDATED */}

                        <div className="rounded-2xl border bg-white p-5">

                            <p className="text-sm text-gray-500">

                                Last location update

                            </p>

                            <p className="mt-1 font-bold">

                                {location.lastUpdatedAt
                                    ? new Date(
                                        location.lastUpdatedAt
                                    ).toLocaleString()
                                    : "Unknown"}

                            </p>

                            <p className="mt-2 text-xs text-gray-400">

                                Location automatically refreshes every 5 seconds.

                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="mt-8 rounded-2xl border bg-white p-12 text-center">

                        <MapPin
                            size={55}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-5 text-2xl font-black">

                            Location Not Available

                        </h2>

                        <p className="mt-2 text-gray-500">

                            The delivery person has not shared their location yet.

                        </p>

                    </div>

                )}

            </div>

        </div>

    );

};


export default TrackDelivery;