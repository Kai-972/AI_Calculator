# Calculator with AI Integration

This project is a web-based calculator with an interactive feature that allows users to draw mathematical equations or problems on a canvas. The drawn content is captured and sent to the backend for analysis. The backend processes the drawing, interprets the math expressions, and returns the solution using Google's Gemini AI model.

---

## Features

- **Interactive Drawing**: Use the canvas to draw mathematical equations or graphical problems.
- **AI-Powered Math Analysis**: The backend uses Google's Gemini AI to interpret and solve the drawn content.
- **Real-Time Results**: Get instant results and solutions from the AI.
- **Responsive Interface**: A user-friendly interface designed for both desktop and mobile devices.

---

## Tech Stack

### Frontend

- **React**: For building the user interface.
- **Vite**: A fast development and build tool.
- **Tailwind CSS**: For styling the application with a modern, utility-first approach.
- **Shadcn & Mantine**: For additional UI components and design.
- **React Router DOM**: For routing and navigation.

### Backend

- **Node.js**: JavaScript runtime for the server-side logic.
- **Express**: Web framework for handling HTTP requests.
- **Google Gemini AI**: The backend uses the Gemini API to solve mathematical problems from the user input.
- **Sharp**: For image processing of the drawn content.

---

## Folder Structure

```plaintext
ipad-calculator/
├── frontend/                # React-based frontend code
│   ├── public/              # Static files
│   ├── src/                 # React components and logic
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js-based backend code
│   ├── apps/                # Contains application-specific code for the backend
│   │   └── calculate/       # The calculation-related logic
│   │       ├── utils.js     # Utility functions for backend processing
│   │       └── route.js     # API routes to handle requests
│   ├── constants.js         # Configuration and environment variables
│   ├── main.js              # Entry point for the backend server
│   ├── schema.js            # Defines the database schema (if applicable)
│   └── package.json         # Backend dependencies
└── README.md                # Project documentation
