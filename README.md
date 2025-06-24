# Hotel Booking System

This project is a hotel booking system built using React, Material-UI, and React Hook Form. It provides functionalities for users to search and filter hotels, create bookings, and manage their profiles. Admin users have additional privileges for managing users, hotels, and bookings.

[Check out the Angular version here](https://github.com/Haowei-Huang/angular-hotel-booking-app)

## Features

- User Authentication:
    - User registration
    - User login/logout
    - Change password
- Hotel Booking:
    - Search and filter hotels
    - Create bookings (admin cannot create bookings)
    - View past bookings
- Admin Dashboard:
    - Manage users (create, view, edit, delete)
    - View hotels
    - View bookings
    - Change own password

## Getting Started
To run the project locally, follow these steps:
1. Clone the repo
``` bash
git clone [repository-url]
cd react-hotel-booking-app
```
2. Install dependencies
``` bash
npm install
```
3. Create a .env file in the root directory and add your backend endpoint string:
```env
REACT_APP_DB_URL=[your_backend_url]
```
4. Set up the backend:
Ensure the backend API is running and accessible.
Create an admin in the database using the following format:
``` json
{
    "email": [adminEmail],
    "role": "admin",
    "password": [adminPassword]
}
```
5. Start the frontend development server:
``` bash
npm start
```
6. Open your browser and navigate to http://localhost:3000 to view the application.

## Tech Stack
- Frontend:
    - React
    - Material-UI (for styling and UI components)
    - React Hook Form (for form handling)
- Backend: The backend is available in 2 versions
    - [Fast API + Python](https://github.com/Haowei-Huang/fast-api-backend)
    - [Express.js + JavaScript + Node.js](https://github.com/Haowei-Huang/express-mongoDB-backend)
- Database
  - MongoDB
