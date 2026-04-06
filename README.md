# Judiciary Information System

The **Judiciary Information System** is a full-stack MERN application designed to manage judiciary processes, including case filing, tracking and managing hearings.

## Project Structure

This is a monorepo-style project with two main directories:
- `frontend`: The React-based user interface built with Vite.
- `backend`: The Node.js and Express server with MongoDB database integration.

## Tech Stack
- **Database**: MongoDB & Mongoose
- **Backend API**: Node.js, Express
- **Frontend App**: React (Vite), React Router, Bootstrap 

## Quick Start

### 1. Setting up the Backend
1. Open a terminal and navigate to the `backend` directory.
   ```bash
   cd backend
   ```
2. Install all required dependencies.
   ```bash
   npm install
   ```
3. Set up the environment variables. Ensure there is a `.env` file in the `backend` directory that contains your `MONGO_URI` and any necessary JWT secrets.
4. Run the backend development server.
   ```bash
   npm run dev
   ```
   The backend API will start up (typically on port 5000).

### 2. Setting up the Frontend
1. Open another terminal and navigate to the `frontend` directory.
   ```bash
   cd frontend
   ```
2. Install all required dependencies.
   ```bash
   npm install
   ```
3. Run the frontend development server.
   ```bash
   npm run dev
   ```
   The frontend layout should now be accessible in your browser at `http://localhost:5173`.

## Features
- **Case Management**: Add, track, view, and close cases.
- **Hearing Logistics**: Log sessions and keep track of attending judges, prosecutors, and next hearing dates.
- **Security**: Basic rate limiting and helmet policies configured.
