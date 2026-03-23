import app from "./app";
import type { Server } from "http";

const PORT = process.env.PORT || 5000;

const server: Server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Set a different PORT in back/.env and update front/.env VITE_BACKEND_URL accordingly.`
    );
    process.exit(1);
  }

  console.error("Failed to start server:", error);
  process.exit(1);
});
