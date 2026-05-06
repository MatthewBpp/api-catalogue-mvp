// Load environment variables early to ensure configuration is available before any module initialises.
// This supports clean separation between code and environment-specific settings.
import dotenv from 'dotenv';
dotenv.config();
import app from './app';

// Resolve the port from the environment with a safe fallback.
// Using Number() ensures consistent typing when the value is injected by hosting platforms.
const port = Number(process.env.PORT) || 4000;

// Start the HTTP server using the fully configured Express application.
// Keeping the server bootstrap minimal supports testability and clean architecture,
// as all routing and middleware composition is delegated to the app module.
app.listen(port, () => {
  console.log(`API Catalogue backend running on port ${port}`);
});
