const DeliveryAssignment =
  require("../models/DeliveryAssignment");

const DeliveryPerson =
  require("../models/DeliveryPerson");


const initializeDeliverySocket =
  (io) => {

    io.on(
      "connection",
      (socket) => {

        console.log(
          "Delivery socket connected:",
          socket.id
        );


        // Delivery person joins delivery room
        socket.on(
          "join-delivery",
          async (data) => {

            try {

              const {
                assignmentId,
              } = data;

              if (!assignmentId) {
                return socket.emit(
                  "delivery-error",
                  {
                    message:
                      "Assignment ID is required.",
                  }
                );
              }


              const assignment =
                await DeliveryAssignment.findById(
                  assignmentId
                );

              if (!assignment) {
                return socket.emit(
                  "delivery-error",
                  {
                    message:
                      "Delivery assignment not found.",
                  }
                );
              }


              const room =
                `delivery:${assignmentId}`;

              socket.join(room);


              socket.emit(
                "joined-delivery",
                {
                  success: true,
                  assignmentId,
                  room,
                }
              );

            } catch (error) {

              socket.emit(
                "delivery-error",
                {
                  message:
                    error.message,
                }
              );
            }
          }
        );


        // Delivery person sends location
        socket.on(
          "update-location",
          async (data) => {

            try {

              const {
                assignmentId,
                userId,
                longitude,
                latitude,
              } = data;


              if (
                !assignmentId ||
                !userId ||
                longitude ===
                  undefined ||
                latitude ===
                  undefined
              ) {
                return socket.emit(
                  "delivery-error",
                  {
                    message:
                      "Assignment ID, user ID, longitude and latitude are required.",
                  }
                );
              }


              const deliveryPerson =
                await DeliveryPerson.findOne({
                  user: userId,
                });


              if (!deliveryPerson) {
                return socket.emit(
                  "delivery-error",
                  {
                    message:
                      "Delivery person not found.",
                  }
                );
              }


              const assignment =
                await DeliveryAssignment.findOne({
                  _id: assignmentId,
                  deliveryPerson:
                    deliveryPerson._id,
                });


              if (!assignment) {
                return socket.emit(
                  "delivery-error",
                  {
                    message:
                      "You are not assigned to this delivery.",
                  }
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
                return socket.emit(
                  "delivery-error",
                  {
                    message:
                      "This delivery is no longer active.",
                  }
                );
              }


              const lng =
                Number(longitude);

              const lat =
                Number(latitude);


              if (
                Number.isNaN(lng) ||
                Number.isNaN(lat)
              ) {
                return socket.emit(
                  "delivery-error",
                  {
                    message:
                      "Invalid coordinates.",
                  }
                );
              }


              if (
                lng < -180 ||
                lng > 180 ||
                lat < -90 ||
                lat > 90
              ) {
                return socket.emit(
                  "delivery-error",
                  {
                    message:
                      "Invalid longitude or latitude.",
                  }
                );
              }


              // Save latest location
              deliveryPerson.currentLocation =
                {
                  type: "Point",
                  coordinates: [
                    lng,
                    lat,
                  ],
                };


              deliveryPerson.lastLocationUpdate =
                new Date();


              await deliveryPerson.save();


              const location = {
                longitude: lng,
                latitude: lat,
                updatedAt:
                  deliveryPerson.lastLocationUpdate,
              };


              const room =
                `delivery:${assignmentId}`;


              // Send location to everyone
              // watching this delivery
              io.to(room).emit(
                "delivery-location-updated",
                {
                  assignmentId,
                  location,
                }
              );


            } catch (error) {

              socket.emit(
                "delivery-error",
                {
                  message:
                    error.message,
                }
              );
            }
          }
        );


        socket.on(
          "leave-delivery",
          (data) => {

            if (
              !data ||
              !data.assignmentId
            ) {
              return;
            }


            socket.leave(
              `delivery:${data.assignmentId}`
            );
          }
        );


        socket.on(
          "disconnect",
          () => {

            console.log(
              "Delivery socket disconnected:",
              socket.id
            );

          }
        );

      }
    );

  };


module.exports =
  initializeDeliverySocket;