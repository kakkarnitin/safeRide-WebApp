# API Specification for SafeRide

## Overview
The SafeRide API provides endpoints for parents to register, verify their identity, offer rides, and manage their credit points. The API is designed to facilitate the sharing of rides among parents of school children, ensuring a safe and community-driven experience.

## Base URL
The base URL for the API is:
```
https://api.saferide.com/v1
```

## Authentication
All endpoints require authentication. Parents must log in to access the API. Use the following endpoint to obtain a JWT token:

### POST /auth/login
- **Request Body:**
  - `email`: string (required)
  - `password`: string (required)

- **Response:**
  - `token`: string (JWT token)
  - `expiresIn`: number (token expiration time in seconds)

## Parent Registration and Verification

### POST /auth/register
- **Request Body:**
  - `name`: string (required)
  - `email`: string (required)
  - `password`: string (required)
  - `drivingLicense`: file (required)
  - `workingWithChildrenCard`: file (required)

- **Response:**
  - `message`: string (confirmation message)
  - `verificationStatus`: string (pending, approved, or rejected)

### GET /auth/verification-status
- **Response:**
  - `verificationStatus`: string (current status of the parent's verification)

## Ride Management

### POST /rides/offer
- **Request Body:**
  - `pickupLocation`: string (required)
  - `dropLocation`: string (required)
  - `availableSeats`: number (required)
  - `dateTime`: string (ISO 8601 format, required)

- **Response:**
  - `rideId`: string (unique identifier for the ride)
  - `message`: string (confirmation message)

### GET /rides
- **Query Parameters:**
  - `pickupLocation`: string (optional)
  - `dropLocation`: string (optional)
  - `dateTime`: string (ISO 8601 format, optional)

- **Response:**
  - `rides`: array of ride objects
    - `rideId`: string
    - `pickupLocation`: string
    - `dropLocation`: string
    - `availableSeats`: number
    - `dateTime`: string

### POST /rides/reserve
- **Request Body:**
  - `rideId`: string (required)
  - `seats`: number (required)

- **Response:**
  - `message`: string (confirmation message)
  - `creditsDebited`: number (credits deducted)

## Credit Management

### GET /credits
- **Response:**
  - `creditsBalance`: number (current credit points)

### POST /credits/transfer
- **Request Body:**
  - `toParentId`: string (required)
  - `points`: number (required)

- **Response:**
  - `message`: string (confirmation message)
  - `creditsBalance`: number (updated credits balance)

## Error Handling
All responses will include a status code and a message. Common status codes include:
- `200 OK`: Successful request
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected error occurred

## Conclusion
This API specification outlines the endpoints available for the SafeRide application, focusing on user registration, ride management, and credit handling. For further details, please refer to the individual endpoint documentation.