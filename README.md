# Todo List REST API

A RESTful API for managing todo items with user authentication and a CRON job to mark expired todos as completed. Built with Node.js, Express, Mongoose, MongoDB, and TypeScript, using a controller-based architecture.

## Features
- User registration and login with JWT authentication
- CRUD operations for todo items (protected routes)
- Daily CRON job to mark expired todos as completed

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)
- npm
- Postman or curl for testing

## Setup
1. Clone the repository:
   git clone https://github.com/vishwajeet012/ThinkWik-Test.git
   cd ThinkWik-Test

Install dependencies:
npm install

Create a .env file in the root directory with:
MONGO_URI=mongodb://localhost:27017/todo-api
JWT_SECRET=your-secure-jwt-secret
PORT=5000

Build the project:
npm run build

Start the server:
npm start

For development with auto-restart:
npm run dev