import {
    ArrowLeft,
    MapPin,
    Navigation,
    RefreshCw,
    StopCircle,
} from "lucide-react";

import {
    Link,
    useSearchParams,
} from "react-router-dom";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import api from "../../services/api";


const DeliveryLiveLocation = () => {

    const [searchParams] =
        useSearchParams();

    const assignmentId =
        searchParams.get(
            "assignment"
        );


    // ==========================================
    // STATE
    // ==========================================

    const [location, setLocation] =
        useState(null);

    const [tracking, setTracking] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const watchId =
        useRef(null);


    // ==========================================
    // CLEANUP
    // ==========================================

    useEffect(() => {

        return () => {

            if (
                watchId.current !== null
            ) {
                navigator.geolocation.clearWatch(
                    watchId.current
                );
            }

        };

    }, []);


    // ==========================================
    // SEND LOCATION
    // ==========================================

    const sendLocation =
        async (
            position
        ) => {

            if (!assignmentId) {
                return;
            }


            const {
                latitude,
                longitude,
                accuracy,
                speed,
                heading,
            } =
                position.coords;


            const locationData = {
                latitude,
                longitude,

                accuracy:
                    accuracy ?? null,

                speed:
                    speed ?? null,

                heading:
                    heading ?? null,
            };


            setLocation(
                locationData
            );


            try {

                await api.post(
                    `/delivery-location/${assignmentId}/update`,
                    locationData
                );


                setSuccess(
                    "Live location updated."
                );

                setError("");

            } catch (err) {

                console.error(
                    "Location update failed:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    "Failed to update delivery location."
                );

            }

        };


    // ==========================================
    // GPS ERROR
    // ==========================================

    const handleLocationError =
        (gpsError) => {

            console.error(
                "GPS error:",
                gpsError
            );


            let message =
                "Unable to get your location.";


            if (
                gpsError.code ===
                1
            ) {
                message =
                    "Location permission was denied. Please allow location access.";
            }

            if (
                gpsError.code ===
                2
            ) {
                message =
                    "Your current location could not be determined.";
            }

            if (
                gpsError.code ===
                3
            ) {
                message =
                    "Location request timed out.";
            }


            setError(message);

            setTracking(false);

        };


    // ==========================================
    // START TRACKING
    // ==========================================

    const startTracking =
        () => {

            if (!assignmentId) {

                setError(
                    "Assignment ID is missing."
                );

                return;
            }


            if (
                !navigator.geolocation
            ) {

                setError(
                    "Geolocation is not supported by this browser."
                );

                return;
            }


            setLoading(true);

            setError("");

            setSuccess("");


            navigator.geolocation.getCurrentPosition(
                (position) => {

                    sendLocation(
                        position
                    );

                    setLoading(false);

                    setTracking(true);

                },

                (gpsError) => {

                    handleLocationError(
                        gpsError
                    );

                    setLoading(false);

                },

                {
                    enableHighAccuracy:
                        true,

                    timeout:
                        15000,

                    maximumAge:
                        0,
                }
            );


            watchId.current =
                navigator.geolocation.watchPosition(
                    sendLocation,

                    handleLocationError,

                    {
                        enableHighAccuracy:
                            true,

                        timeout:
                            15000,

                        maximumAge:
                            5000,
                    }
                );


            setTracking(true);

        };


    // ==========================================
    // STOP TRACKING
    // ==========================================

    const stopTracking =
        async () => {

            try {

                if (
                    watchId.current !==
                    null
                ) {

                    navigator.geolocation.clearWatch(
                        watchId.current
                    );

                    watchId.current =
                        null;

                }


                if (
                    assignmentId
                ) {

                    await api.post(
                        `/delivery-location/${assignmentId}/stop`
                    );

                }


                setTracking(
                    false
                );

                setSuccess(
                    "Live location tracking stopped."
                );

            } catch (err) {

                console.error(
                    "Failed to stop tracking:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    "Failed to stop location tracking."
                );

            }

        };


    // ==========================================
    // REFRESH CURRENT LOCATION
    // ==========================================

    const refreshLocation =
        () => {

            if (
                !navigator.geolocation
            ) {
                return;
            }


            navigator.geolocation.getCurrentPosition(
                sendLocation,

                handleLocationError,

                {
                    enableHighAccuracy:
                        true,

                    timeout:
                        15000,

                    maximumAge:
                        0,
                }
            );

        };


    // ==========================================
    // GOOGLE MAP LINK
    // ==========================================

    const openMap =
        () => {

            if (!location) {
                return;
            }


            const url =
                `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;


            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

                {/* HEADER */}

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                        <Link
                            to="/delivery"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                        >
                            <ArrowLeft size={17} />

                            Back to Dashboard

                        </Link>


                        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-500">

                            Delivery Panel

                        </p>


                        <h1 className="mt-1 text-3xl font-black sm:text-4xl">

                            Live Location

                        </h1>


                        <p className="mt-2 text-gray-500">

                            Share your current location while delivering an order.

                        </p>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <p className="font-bold text-red-700">

                            Location Error

                        </p>

                        <p className="mt-1 text-sm text-red-600">

                            {error}

                        </p>

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

                        <p className="font-bold text-green-700">

                            Location Status

                        </p>

                        <p className="mt-1 text-sm text-green-600">

                            {success}

                        </p>

                    </div>

                )}


                {/* ASSIGNMENT */}

                {!assignmentId ? (

                    <div className="mt-8 rounded-2xl border bg-white p-10 text-center">

                        <MapPin
                            size={55}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-5 text-2xl font-black">

                            Assignment Required

                        </h2>

                        <p className="mt-2 text-gray-500">

                            Open live tracking from a delivery assignment.

                        </p>

                    </div>

                ) : (

                    <div className="mt-8 space-y-6">

                        {/* STATUS CARD */}

                        <div className="rounded-2xl border bg-white p-6">

                            <div className="flex items-center gap-4">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">

                                    <Navigation
                                        size={25}
                                    />

                                </div>


                                <div>

                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">

                                        Tracking Status

                                    </p>


                                    <h2 className="mt-1 text-xl font-black">

                                        {tracking
                                            ? "Location Sharing Active"
                                            : "Location Sharing Off"}

                                    </h2>

                                </div>

                            </div>


                            <div className="mt-6 flex flex-wrap gap-3">

                                {!tracking ? (

                                    <button
                                        type="button"
                                        onClick={
                                            startTracking
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                                    >

                                        <Navigation
                                            size={18}
                                        />

                                        {loading
                                            ? "Starting..."
                                            : "Start Live Tracking"}

                                    </button>

                                ) : (

                                    <button
                                        type="button"
                                        onClick={
                                            stopTracking
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-700 hover:bg-red-100"
                                    >

                                        <StopCircle
                                            size={18}
                                        />

                                        Stop Tracking

                                    </button>

                                )}


                                <button
                                    type="button"
                                    onClick={
                                        refreshLocation
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"
                                >

                                    <RefreshCw
                                        size={18}
                                    />

                                    Refresh Location

                                </button>

                            </div>

                        </div>


                        {/* LOCATION CARD */}

                        <div className="rounded-2xl border bg-white p-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                                    <MapPin
                                        size={22}
                                    />

                                </div>


                                <div>

                                    <h2 className="text-xl font-black">

                                        Current Location

                                    </h2>

                                    <p className="text-sm text-gray-500">

                                        Your latest GPS coordinates

                                    </p>

                                </div>

                            </div>


                            {!location ? (

                                <div className="mt-8 rounded-2xl bg-gray-50 p-10 text-center">

                                    <MapPin
                                        size={50}
                                        className="mx-auto text-gray-300"
                                    />

                                    <p className="mt-4 font-semibold text-gray-600">

                                        Location not available yet.

                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">

                                        Start live tracking to share your location.

                                    </p>

                                </div>

                            ) : (

                                <div className="mt-6">

                                    <div className="grid gap-4 sm:grid-cols-2">

                                        <div className="rounded-xl bg-gray-50 p-5">

                                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">

                                                Latitude

                                            </p>

                                            <p className="mt-2 break-all font-mono text-lg font-bold">

                                                {location.latitude}

                                            </p>

                                        </div>


                                        <div className="rounded-xl bg-gray-50 p-5">

                                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">

                                                Longitude

                                            </p>

                                            <p className="mt-2 break-all font-mono text-lg font-bold">

                                                {location.longitude}

                                            </p>

                                        </div>


                                        <div className="rounded-xl bg-gray-50 p-5">

                                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">

                                                Accuracy

                                            </p>

                                            <p className="mt-2 text-lg font-bold">

                                                {location.accuracy
                                                    ? `${Math.round(location.accuracy)} meters`
                                                    : "N/A"}

                                            </p>

                                        </div>


                                        <div className="rounded-xl bg-gray-50 p-5">

                                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">

                                                Speed

                                            </p>

                                            <p className="mt-2 text-lg font-bold">

                                                {location.speed
                                                    ? `${(
                                                        location.speed *
                                                        3.6
                                                    ).toFixed(1)} km/h`
                                                    : "N/A"}

                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            openMap
                                        }
                                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                                    >

                                        <MapPin
                                            size={18}
                                        />

                                        Open in Google Maps

                                    </button>

                                </div>

                            )}

                        </div>


                        {/* INSTRUCTIONS */}

                        <div className="rounded-2xl border bg-white p-6">

                            <h2 className="text-lg font-black">

                                How Live Tracking Works

                            </h2>


                            <div className="mt-5 space-y-4">

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">

                                        1

                                    </div>

                                    <p className="text-sm text-gray-600">

                                        Start live tracking before leaving for delivery.

                                    </p>

                                </div>


                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">

                                        2

                                    </div>

                                    <p className="text-sm text-gray-600">

                                        Allow the browser to access your GPS location.

                                    </p>

                                </div>


                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">

                                        3

                                    </div>

                                    <p className="text-sm text-gray-600">

                                        Your latest coordinates are automatically sent to KarigarConnect.

                                    </p>

                                </div>


                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">

                                        4

                                    </div>

                                    <p className="text-sm text-gray-600">

                                        Stop tracking after completing the delivery.

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
};


export default DeliveryLiveLocation;