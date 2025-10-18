import express from 'express';
import cors from 'cors'; // Import the cors middleware
import { router as calculatorRouter } from './apps/calculator/route.js'; // Import the calculator routes
import { SERVER_URL, PORT, ENV } from './constants.js'; // Import constants (server URL, port, etc.)

const app = express();

// Middleware setup
app.use(cors({
  origin: '*', // Allow all origins
  methods: '*', // Allow all methods (GET, POST, etc.)
  allowedHeaders: '*', // Allow all headers
}));

// Middleware to parse JSON data
app.use(express.json());

// Root endpoint to check if the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Include the calculator routes
app.use('/calculate', calculatorRouter); // The prefix `/calculate` matches the `/calculate` in the Python backend

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on ${SERVER_URL}:${PORT} in ${ENV} mode`);
});
