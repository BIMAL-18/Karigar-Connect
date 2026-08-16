import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

// Leaflet
import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";

// Leaflet marker images
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Services
import orderService from "../../services/orderService";

/*
|--------------------------------------------------------------------------
| Fix Leaflet Default Marker Icons
|--------------------------------------------------------------------------
*/

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/*
|--------------------------------------------------------------------------
| Delivery Tracking Component
|--------------------------------------------------------------------------
*/

const DeliveryTracking = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [tracking, setTracking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Convert Location to Leaflet Coordinates
  |--------------------------------------------------------------------------
  |
  | GeoJSON:
  |
  | [longitude, latitude]
  |
  | Leaflet:
  |
  | [latitude, longitude]
  |
  */

  const getCoordinates = (location) => {
    if (!location) {
      return null;
    }

    /*
    |--------------------------------------------------------------------------
    | GeoJSON Point
    |--------------------------------------------------------------------------
    */

    if (
      location.type === "Point" &&
      Array.isArray(location.coordinates) &&
      location.coordinates.length === 2
    ) {
      const [
        longitude,
        latitude,
      ] = location.coordinates;

      const lat = Number(latitude);
      const lng = Number(longitude);

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        return [lat, lng];
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Direct coordinates array
    |--------------------------------------------------------------------------
    */

    if (
      Array.isArray(location) &&
      location.length === 2
    ) {
      const [
        longitude,
        latitude,
      ] = location;

      const lat = Number(latitude);
      const lng = Number(longitude);

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        return [lat, lng];
      }
    }

    /*
    |--------------------------------------------------------------------------
    | latitude / longitude object
    |--------------------------------------------------------------------------
    */

    if (
      location.latitude !== undefined &&
      location.longitude !== undefined
    ) {
      const lat = Number(
        location.latitude
      );

      const lng = Number(
        location.longitude
      );

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        return [lat, lng];
      }
    }

    /*
    |--------------------------------------------------------------------------
    | lat / lng object
    |--------------------------------------------------------------------------
    */

    if (
      location.lat !== undefined &&
      location.lng !== undefined
    ) {
      const lat = Number(
        location.lat
      );

      const lng = Number(
        location.lng
      );

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        return [lat, lng];
      }
    }

    return null;
  };

  /*
  |--------------------------------------------------------------------------
  | Load Order + Tracking
  |--------------------------------------------------------------------------
  */

  const loadTracking = async () => {
    try {
      setError("");

      const response =
        await orderService.getOrderById(id);

      const orderData =
        response?.order ||
        response?.data ||
        response;

      if (!orderData) {
        throw new Error(
          "Order not found."
        );
      }

      setOrder(orderData);

      /*
      |--------------------------------------------------------------------------
      | Try different possible backend structures
      |--------------------------------------------------------------------------
      */

      const trackingData =
        orderData.delivery ||
        orderData.deliveryAssignment ||
        orderData.tracking ||
        orderData.deliveryRoute ||
        null;

      setTracking(trackingData);
    } catch (error) {
      console.error(
        "Failed to load tracking:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load delivery tracking."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Load + Auto Refresh
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadTracking();

    /*
    |--------------------------------------------------------------------------
    | Refresh every 10 seconds
    |--------------------------------------------------------------------------
    */

    const interval =
      setInterval(() => {
        loadTracking();
      }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Format Status
  |--------------------------------------------------------------------------
  */

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="animate-pulse space-y-6">

            <div className="h-8 w-48 rounded bg-gray-200" />

            <div className="h-[450px] rounded-2xl bg-gray-200" />

            <div className="grid gap-6 lg:grid-cols-2">

              <div className="h-56 rounded-2xl bg-gray-200" />

              <div className="h-56 rounded-2xl bg-gray-200" />

            </div>

          </div>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="text-center">

          <Package
            size={55}
            className="mx-auto text-gray-300"
          />

          <h1 className="mt-5 text-2xl font-black">
            Tracking Unavailable
          </h1>

          <p className="mt-2 text-gray-500">
            {error ||
              "We couldn't find this order."}
          </p>

          <Link
            to={`/orders/${id}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            <ArrowLeft size={17} />
            Back to Order
          </Link>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delivery Person
  |--------------------------------------------------------------------------
  */

  const deliveryPerson =
    tracking?.deliveryPerson ||
    tracking?.driver ||
    order.deliveryPerson ||
    order.deliveryAssignment
      ?.deliveryPerson;

  /*
  |--------------------------------------------------------------------------
  | Current Delivery Location
  |--------------------------------------------------------------------------
  */

  const currentLocation =
    tracking?.currentLocation ||
    tracking?.location ||
    tracking?.deliveryLocation ||
    order.deliveryAssignment
      ?.currentLocation ||
    order.deliveryAssignment
      ?.deliveryLocation;

  /*
  |--------------------------------------------------------------------------
  | Customer Destination
  |--------------------------------------------------------------------------
  */

  const destination =
    order.deliveryAddress
      ?.location ||
    order.deliveryAddress
      ?.coordinates ||
    order.deliveryAddress
      ?.destination ||
    order.deliveryLocation;

  /*
  |--------------------------------------------------------------------------
  | Convert Locations for Leaflet
  |--------------------------------------------------------------------------
  */

  const deliveryPosition =
    getCoordinates(
      currentLocation
    );

  const customerPosition =
    getCoordinates(
      destination
    );

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  const deliveryStatus =
    tracking?.status ||
    order.status;

  const isDelivered =
    order.status ===
    "DELIVERED";

  const isOutForDelivery =
    [
      "ASSIGNED",
      "PICKED_UP",
      "OUT_FOR_DELIVERY",
    ].includes(
      order.status
    );

  /*
  |--------------------------------------------------------------------------
  | Map Center
  |--------------------------------------------------------------------------
  */

  const mapCenter =
    deliveryPosition ||
    customerPosition || [
      27.7172,
      85.324,
    ];

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* =========================================================
            BACK BUTTON
        ========================================================== */}

        <Link
          to={`/orders/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Order
        </Link>

        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Delivery Tracking
            </p>

            <h1 className="mt-1 text-3xl font-black sm:text-4xl">
              Track Your Order
            </h1>

            <p className="mt-2 break-all text-sm text-gray-500">
              Order #{order._id}
            </p>

          </div>

          <div
            className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
              isDelivered
                ? "bg-green-100 text-green-700"
                : isOutForDelivery
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {formatStatus(
              deliveryStatus
            )}
          </div>

        </div>

        {/* =========================================================
            LIVE MAP
        ========================================================== */}

        <div className="mt-8 overflow-hidden rounded-3xl border bg-white">

          {/* Map Header */}

          <div className="flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <Navigation size={20} />
              </div>

              <div>

                <h2 className="font-black">
                  Live Delivery Map
                </h2>

                <p className="text-sm text-gray-500">
                  Delivery location updates
                  automatically.
                </p>

              </div>

            </div>

            {isOutForDelivery && (
              <div className="flex items-center gap-2 text-sm font-semibold text-green-600">

                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

                Live

              </div>
            )}

          </div>

          {/* =======================================================
              MAP
          ======================================================== */}

          <div className="h-[450px] w-full">

            {deliveryPosition ||
            customerPosition ? (

              <MapContainer
                center={mapCenter}
                zoom={14}
                scrollWheelZoom={true}
                className="h-full w-full"
              >

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* =================================================
                    DELIVERY PERSON MARKER
                ================================================== */}

                {deliveryPosition && (
                  <Marker
                    position={
                      deliveryPosition
                    }
                  >

                    <Popup>

                      <div className="text-center">

                        <strong>
                          🚚 Delivery Person
                        </strong>

                        <br />

                        Current delivery
                        location

                      </div>

                    </Popup>

                  </Marker>
                )}

                {/* =================================================
                    CUSTOMER MARKER
                ================================================== */}

                {customerPosition && (
                  <Marker
                    position={
                      customerPosition
                    }
                  >

                    <Popup>

                      <div className="text-center">

                        <strong>
                          📍 Your Location
                        </strong>

                        <br />

                        Delivery destination

                      </div>

                    </Popup>

                  </Marker>
                )}

                {/* =================================================
                    DELIVERY ROUTE
                ================================================== */}

                {deliveryPosition &&
                  customerPosition && (
                    <Polyline
                      positions={[
                        deliveryPosition,
                        customerPosition,
                      ]}
                    />
                  )}

              </MapContainer>

            ) : (

              /* ===================================================
                 NO LOCATION
              ==================================================== */

              <div className="flex h-full items-center justify-center bg-gray-100">

                <div className="px-6 text-center">

                  <MapPin
                    size={50}
                    className="mx-auto text-gray-400"
                  />

                  <h3 className="mt-4 text-lg font-black">
                    Location Not Available
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                    The delivery person's
                    live location will appear
                    here once tracking starts.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

        {/* =========================================================
            DELIVERY PERSON + STATUS
        ========================================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* =======================================================
              DELIVERY PERSON
          ======================================================== */}

          <div className="rounded-2xl border bg-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <User size={21} />
              </div>

              <div>

                <h2 className="text-xl font-black">
                  Delivery Person
                </h2>

                <p className="text-sm text-gray-500">
                  Your delivery partner
                </p>

              </div>

            </div>

            {deliveryPerson ? (

              <div className="mt-6">

                <div className="flex items-center gap-4">

                  {/* Avatar */}

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <User size={25} />
                  </div>

                  {/* Details */}

                  <div className="min-w-0">

                    <h3 className="truncate font-black">

                      {deliveryPerson.name ||
                        deliveryPerson.fullName ||
                        deliveryPerson.user?.name ||
                        "Delivery Person"}

                    </h3>

                    {deliveryPerson.phone && (
                      <p className="mt-1 text-sm text-gray-500">
                        {
                          deliveryPerson.phone
                        }
                      </p>
                    )}

                  </div>

                </div>

                {/* Call */}

                {deliveryPerson.phone && (
                  <a
                    href={`tel:${deliveryPerson.phone}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold transition hover:bg-gray-50"
                  >
                    <Phone size={18} />
                    Call Delivery Person
                  </a>
                )}

              </div>

            ) : (

              <div className="mt-6 rounded-xl bg-gray-50 p-5 text-center">

                <Clock
                  size={30}
                  className="mx-auto text-gray-400"
                />

                <p className="mt-3 font-bold">
                  Delivery Not Assigned
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  A delivery person will
                  be assigned soon.
                </p>

              </div>

            )}

          </div>

          {/* =======================================================
              DELIVERY STATUS
          ======================================================== */}

          <div className="rounded-2xl border bg-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <Truck size={21} />
              </div>

              <div>

                <h2 className="text-xl font-black">
                  Delivery Status
                </h2>

                <p className="text-sm text-gray-500">
                  Current delivery progress
                </p>

              </div>

            </div>

            <div className="mt-6 space-y-5">

              {/* Status */}

              <div className="flex items-center gap-4">

                <CheckCircle
                  size={22}
                  className={
                    isOutForDelivery ||
                    isDelivered
                      ? "text-green-600"
                      : "text-gray-300"
                  }
                />

                <div>

                  <p className="font-bold">
                    {formatStatus(
                      deliveryStatus
                    )}
                  </p>

                  <p className="text-sm text-gray-500">
                    Current order status
                  </p>

                </div>

              </div>

              {/* Address */}

              <div className="flex items-start gap-4">

                <MapPin
                  size={22}
                  className="mt-0.5 shrink-0 text-gray-500"
                />

                <div>

                  <p className="font-bold">
                    Delivery Address
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.deliveryAddress
                      ?.address ||
                      "Address unavailable"}
                  </p>

                  {order.deliveryAddress
                    ?.municipality && (
                    <p className="mt-1 text-sm text-gray-400">
                      {
                        order
                          .deliveryAddress
                          .municipality
                      }

                      {order
                        .deliveryAddress
                        .district &&
                        `, ${order.deliveryAddress.district}`}
                    </p>
                  )}

                </div>

              </div>

              {/* Current location */}

              {deliveryPosition && (
                <div className="flex items-start gap-4">

                  <Navigation
                    size={22}
                    className="mt-0.5 shrink-0 text-gray-500"
                  />

                  <div>

                    <p className="font-bold">
                      Current Location
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Delivery location
                      received successfully.
                    </p>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* =========================================================
            ORDER INFORMATION
        ========================================================== */}

        <div className="mt-8 rounded-2xl border bg-white p-6">

          <div className="flex items-center gap-3">

            <Package size={21} />

            <h2 className="text-xl font-black">
              Order Information
            </h2>

          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">

            {/* Order ID */}

            <div>

              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Order ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold">
                {order._id}
              </p>

            </div>

            {/* Status */}

            <div>

              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Status
              </p>

              <p className="mt-1 text-sm font-semibold">
                {formatStatus(
                  order.status
                )}
              </p>

            </div>

            {/* Total */}

            <div>

              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Total
              </p>

              <p className="mt-1 text-sm font-semibold">
                Rs.{" "}
                {Number(
                  order.totalAmount ||
                    order.total ||
                    0
                ).toLocaleString()}
              </p>

            </div>

          </div>

        </div>

        {/* =========================================================
            BACK TO ORDER
        ========================================================== */}

        <div className="mt-8">

          <Link
            to={`/orders/${id}`}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-5 py-3 font-semibold transition hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back to Order Details
          </Link>

        </div>

      </div>

    </div>
  );
};

export default DeliveryTracking;