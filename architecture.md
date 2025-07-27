# Architecture of Codeloom

Codeloom is a platform designed for coding challenges and competitions, built with a modern tech stack to ensure scalability, performance, and ease of use. Below is an overview of the architecture and components involved in Codeloom.

## Architecture Overview

The architecture of Codeloom is divided into two main parts: the **Frontend** and the **Backend**.
The **Frontend** is responsible for the user interface and user experience, while the **Backend** handles business logic, data management, and integration with external services.
## Frontend
The frontend is built using modern JavaScript frameworks and libraries, providing a responsive and interactive user interface. It communicates with the backend via RESTful APIs.
## Backend
The backend is built with Node.js and Express, providing a robust server-side application. It handles
user authentication, data processing, and integration with external APIs such as Judge0 for code execution and Cloudinary for media management.
## Dependencies Installation
1. Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
2. Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

# Frontend
 ### folder structure
The frontend is structured to separate concerns and enhance maintainability. Key directories include:
- `src/components`: Contains reusable UI components.
- `src/pages`: Contains page components that represent different views in the application.
- `src/services`: Contains API service modules for making HTTP requests to the backend.
- `src/libs`: Contains utility functions and helpers used throughout the application.
- `src/assets`: Contains static assets such as images and stylesheets.
- `src/store`: Contains state management logic, typically using a library like Redux or Context API.
- `src/styles`: Contains global styles and theme configurations.
- `src/schema`: Contains zod schemas for form validation and data handling.
- `src/themes`:Contains themes for code editor and other UI elements.


# Backend
### folder structure
The backend is organized to facilitate clear separation of concerns and modularity. Key directories include:
- `controllers`: Contains request handlers for different routes, managing the flow of data between the client and the database.

- `routes`: Contains route definitions, mapping HTTP requests to the appropriate controllers.
- `middleware`: Contains middleware functions for request validation, authentication, and error handling.
- `libs`: Contains utility functions and helpers used across the application.
- `prisma`: Contains Prisma client setup and database migration files.




 


