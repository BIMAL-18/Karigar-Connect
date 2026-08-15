// require("dotenv").config();

// const app = require("./app");
// const connectDB = require("./src/config/db");
// const checkEnvironmentVariables = require("./src/config/env");

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     checkEnvironmentVariables();

//     await connectDB();

//     app.listen(PORT, () => {
//       console.log(
//         `KarigarConnect server running on http://localhost:${PORT}`
//       );
//     });
//   } catch (error) {
//     console.error(
//       "Failed to start server:",
//       error.message
//     );

//     process.exit(1);
//   }
// };

// startServer();
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./src/config/db");
const checkEnvironmentVariables = require("./src/config/env");
const initializeDeliverySocket =
  require("./src/sockets/deliverySocket");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],

    credentials: true,
  },
});

// Socket connection
io.on("connection", (socket) => {
  console.log(
    "Socket connected:",
    socket.id
  );

  socket.on("disconnect", () => {
    console.log(
      "Socket disconnected:",
      socket.id
    );
  });
});
// initialize delivery socket
initializeDeliverySocket(io);
// Start server
const startServer = async () => {
  try {
    checkEnvironmentVariables();

    await connectDB();

    server.listen(PORT, () => {
      console.log(
        `KarigarConnect server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
