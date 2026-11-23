import mongoose from "mongoose";
import app from "./app.js";
import { connectDatabase, missingSettings } from "./server/db.js";

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  const missing = missingSettings();
  if (missing.length > 0) {
    console.error(`Missing environment settings: ${missing.join(", ")}`);
    process.exit(1);
  }

  try {
    await connectDatabase();
    console.log("Connected database:", mongoose.connection.name);
    console.log("Connected host:", mongoose.connection.host);

    app.listen(port, () => {
      console.log(`Portfolio API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Startup failed:", { name: error.name, code: error.code, codeName: error.codeName });
    process.exit(1);
  }
}

startServer();
