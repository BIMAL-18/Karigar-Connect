const DeliveryAssignment =
  require("../models/DeliveryAssignment");

const DeliveryPerson =
  require("../models/DeliveryPerson");


// Calculate route
const calculateRoute = async (
  userId,
  assignmentId,
  destinationLongitude,
  destinationLatitude
) => {
  const deliveryPerson =
    await DeliveryPerson.findOne({
      user: userId,
    });

  if (!deliveryPerson) {
    throw new Error(
      "Delivery person profile not found."
    );
  }

  const assignment =
    await DeliveryAssignment.findOne({
      _id: assignmentId,
      deliveryPerson:
        deliveryPerson._id,
    });

  if (!assignment) {
    throw new Error(
      "Delivery assignment not found."
    );
  }

  if (
    [
      "DELIVERED",
      "CANCELLED",
      "REJECTED",
    ].includes(
      assignment.status
    )
  ) {
    throw new Error(
      "This delivery is no longer active."
    );
  }


  const currentCoordinates =
    deliveryPerson.currentLocation
      ?.coordinates;


  if (
    !currentCoordinates ||
    currentCoordinates.length !== 2 ||
    (
      currentCoordinates[0] === 0 &&
      currentCoordinates[1] === 0
    )
  ) {
    throw new Error(
      "Delivery person's current location is not available."
    );
  }


  const destinationLng =
    Number(
      destinationLongitude
    );

  const destinationLat =
    Number(
      destinationLatitude
    );


  if (
    Number.isNaN(
      destinationLng
    ) ||
    Number.isNaN(
      destinationLat
    )
  ) {
    throw new Error(
      "Invalid destination coordinates."
    );
  }


  if (
    destinationLng < -180 ||
    destinationLng > 180 ||
    destinationLat < -90 ||
    destinationLat > 90
  ) {
    throw new Error(
      "Invalid longitude or latitude."
    );
  }


  const [
    currentLng,
    currentLat,
  ] = currentCoordinates;


  /*
   * OSRM expects:
   * longitude,latitude
   */

  const osrmUrl =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${currentLng},${currentLat};` +
    `${destinationLng},${destinationLat}` +
    `?overview=full&geometries=geojson`;


  const response =
    await fetch(osrmUrl);


  if (!response.ok) {
    throw new Error(
      "Unable to calculate delivery route."
    );
  }


  const data =
    await response.json();


  if (
    !data.routes ||
    !data.routes.length
  ) {
    throw new Error(
      "No delivery route found."
    );
  }


  const route =
    data.routes[0];


  /*
   * OSRM distance is in meters.
   * Convert to kilometers.
   */

  const distance =
    Number(
      (
        route.distance / 1000
      ).toFixed(2)
    );


  /*
   * OSRM duration is in seconds.
   * Convert to minutes.
   */

  const estimatedTime =
    Math.ceil(
      route.duration / 60
    );


  const routeCoordinates =
    route.geometry.coordinates;


  // Save destination
  assignment.deliveryLocation =
    {
      type: "Point",
      coordinates: [
        destinationLng,
        destinationLat,
      ],
    };


  // Save route
  assignment.route =
    routeCoordinates;


  assignment.distance =
    distance;


  assignment.estimatedTime =
    estimatedTime;


  assignment.routeUpdatedAt =
    new Date();


  await assignment.save();


  return {
    assignmentId:
      assignment._id,

    currentLocation: {
      longitude:
        currentLng,
      latitude:
        currentLat,
    },

    destination: {
      longitude:
        destinationLng,
      latitude:
        destinationLat,
    },

    distance,

    estimatedTime,

    route:
      routeCoordinates,

    routeUpdatedAt:
      assignment.routeUpdatedAt,
  };
};


module.exports = {
  calculateRoute,
};