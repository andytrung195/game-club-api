# Game Club API Documentation

## Overview

The Game Club API is a RESTful web service for managing game clubs and their events. It provides endpoints for creating, retrieving, and managing gaming communities and their scheduled activities.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow a consistent JSON format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Error description",
  "field": "fieldName", // For validation errors
  "validationError": "Specific validation message"
}
```

## HTTP Status Codes

- `200` - OK (successful GET requests)
- `201` - Created (successful POST requests)
- `400` - Bad Request (validation errors)
- `404` - Not Found (resource not found)
- `409` - Conflict (duplicate resources)
- `500` - Internal Server Error

## Endpoints

### Health Check

#### GET /api/health
Check if the API is running and healthy.

**Response:**
```json
{
  "success": true,
  "message": "Game Club API is running",
  "data": {
    "timestamp": "2024-09-27T07:44:30.085Z"
  }
}
```

#### GET /
Get API information and available endpoints.

**Response:**
```json
{
  "success": true,
  "message": "Welcome to Game Club API",
  "data": {
    "version": "1.0.0",
    "documentation": "/api-docs",
    "endpoints": {
      "clubs": "/clubs",
      "events": "/clubs/:id/events",
      "health": "/api/health"
    }
  }
}
```

### Clubs

#### GET /clubs
Retrieve all game clubs with optional search functionality.

**Query Parameters:**
- `search` (optional): Search term to filter clubs by name or description

**Example Request:**
```
GET /clubs?search=gaming
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Gaming Enthusiasts",
      "description": "A club for passionate gamers",
      "created_at": "2024-09-27T07:44:30.085Z",
      "updated_at": "2024-09-27T07:44:30.085Z"
    }
  ]
}
```

#### POST /clubs
Create a new game club.

**Request Body:**
```json
{
  "name": "Gaming Enthusiasts",
  "description": "A club for passionate gamers"
}
```

**Validation Rules:**
- `name`: Required, string, max 100 characters, must be unique
- `description`: Required, string, cannot be empty

**Success Response (201):**
```json
{
  "success": true,
  "message": "Club created successfully",
  "data": {
    "id": 1,
    "name": "Gaming Enthusiasts",
    "description": "A club for passionate gamers",
    "created_at": "2024-09-27T07:44:30.085Z",
    "updated_at": "2024-09-27T07:44:30.085Z"
  }
}
```

**Error Responses:**
- `400`: Validation error (missing required fields)
- `409`: Club name already exists

### Events

#### GET /clubs/:id/events
Retrieve all events for a specific club, ordered by event date.

**Path Parameters:**
- `id`: Club ID (integer)

**Example Request:**
```
GET /clubs/1/events
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "club_id": 1,
      "title": "Weekly Gaming Night",
      "description": "Join us for an evening of gaming and fun",
      "event_date": "2024-12-31T18:00:00Z",
      "created_at": "2024-09-27T07:44:30.085Z",
      "updated_at": "2024-09-27T07:44:30.085Z"
    }
  ]
}
```

**Error Responses:**
- `404`: Club not found

#### POST /clubs/:id/events
Create a new event for a specific club.

**Path Parameters:**
- `id`: Club ID (integer)

**Request Body:**
```json
{
  "title": "Weekly Gaming Night",
  "description": "Join us for an evening of gaming and fun",
  "event_date": "2024-12-31T18:00:00Z"
}
```

**Validation Rules:**
- `title`: Required, string, max 100 characters
- `description`: Required, string, cannot be empty
- `event_date`: Required, valid ISO 8601 date string

**Success Response (201):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": 1,
    "club_id": 1,
    "title": "Weekly Gaming Night",
    "description": "Join us for an evening of gaming and fun",
    "event_date": "2024-12-31T18:00:00Z",
    "created_at": "2024-09-27T07:44:30.085Z",
    "updated_at": "2024-09-27T07:44:30.085Z"
  }
}
```

**Error Responses:**
- `400`: Validation error (missing required fields or invalid date)
- `404`: Club not found

## Data Models

### Club
```json
{
  "id": 1,
  "name": "Gaming Enthusiasts",
  "description": "A club for passionate gamers",
  "created_at": "2024-09-27T07:44:30.085Z",
  "updated_at": "2024-09-27T07:44:30.085Z"
}
```

### Event
```json
{
  "id": 1,
  "club_id": 1,
  "title": "Weekly Gaming Night",
  "description": "Join us for an evening of gaming and fun",
  "event_date": "2024-12-31T18:00:00Z",
  "created_at": "2024-09-27T07:44:30.085Z",
  "updated_at": "2024-09-27T07:44:30.085Z"
}
```

## Error Handling

The API provides detailed error messages for different scenarios:

### Validation Errors (400)
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Validation failed",
  "field": "name",
  "validationError": "Club name is required"
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Club with ID 999 not found"
}
```

### Conflict Errors (409)
```json
{
  "success": false,
  "error": "Conflict",
  "message": "A club with this name already exists"
}
```

### Internal Server Errors (500)
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Internal server error"
}
```

## Testing

### Interactive Documentation
- **Swagger UI**: http://localhost:3000/api-docs
- **Web Interface**: http://localhost:3000

### Postman Collection
Import the Postman collection from `docs/Game_Club_API.postman_collection.json` for comprehensive API testing.

### Sample Requests

#### Create a Club
```bash
curl -X POST http://localhost:3000/clubs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Enthusiasts",
    "description": "A club for passionate gamers"
  }'
```

#### Create an Event
```bash
curl -X POST http://localhost:3000/clubs/1/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Weekly Gaming Night",
    "description": "Join us for an evening of gaming and fun",
    "event_date": "2024-12-31T18:00:00Z"
  }'
```

#### Search Clubs
```bash
curl "http://localhost:3000/clubs?search=gaming"
```

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

The API supports Cross-Origin Resource Sharing (CORS) and accepts requests from any origin.

## Database

The API uses SQLite with Sequelize ORM for data persistence. The database file is located at `data/game_club.db`.

## Logging

The API includes comprehensive logging:
- Request/response logging
- Error logging
- Database operation logging
- Business logic logging

Log files are stored in the `logs/` directory.

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
npm install
```

### Running the Server
```bash
npm start
# or for development with auto-restart
npm run dev
```

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Support

For support or questions about the API, please refer to the Swagger documentation at `/api-docs` or the web interface at the root URL.
