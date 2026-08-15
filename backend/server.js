require("dotenv").config();

const app = require("./app");
const connectDB = require("./src/config/db");
const checkEnvironmentVariables = require("./src/config/env");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    checkEnvironmentVariables();

    await connectDB();

    app.listen(PORT, () => {
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
