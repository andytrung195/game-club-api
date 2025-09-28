# Game Club API

A RESTful API for managing game clubs and their events, built with Node.js, Express, and SQLite.

## Features

- **Club Management**: Create, read, update, and delete game clubs
- **Event Management**: Create, read, update, and delete events for specific clubs
- **Data Validation**: Comprehensive input validation for all endpoints
- **SQLite Database**: Lightweight, file-based database for easy setup
- **Sequelize ORM**: Modern Object-Relational Mapping for database operations
- **RESTful Design**: Clean, intuitive API endpoints
- **Comprehensive Logging**: Detailed logging system for debugging and monitoring
- **Search Functionality**: Search clubs by name or description
- **Postman Collection**: Ready-to-use Postman collection for API testing

## Project Structure

```
game-club-api/
├── node_modules/
├── src/
│   ├── config/
│   │   ├── database.js           # Legacy SQLite setup and connection
│   │   ├── sequelize.js          # Sequelize ORM configuration
│   │   └── swagger.js            # Swagger/OpenAPI documentation setup
│   ├── constants/
│   │   └── statusCodes.js        # Centralized HTTP status codes and messages
│   ├── controllers/
│   │   ├── clubController.js     # Logic for club creation, retrieval
│   │   └── eventController.js    # Logic for event creation, retrieval
│   ├── middleware/
│   │   ├── loggingMiddleware.js  # Request/response logging middleware
│   │   └── validationMiddleware.js # Input validation middleware
│   ├── models/
│   │   ├── index.js              # Model associations and exports
│   │   ├── Club.js               # Club Sequelize model
│   │   └── Event.js              # Event Sequelize model
│   ├── routes/
│   │   ├── clubRoutes.js         # Defines /clubs endpoints
│   │   └── eventRoutes.js        # Defines /clubs/:id/events endpoints
│   ├── services/
│   │   ├── loggerService.js      # Comprehensive logging service
│   │   ├── queryService.js       # Centralized database query service
│   │   └── validationService.js  # Utility for basic input validation
│   └── app.js                    # Main Express application setup
├── docs/
│   ├── API_Documentation.md      # Comprehensive API documentation
│   └── Game_Club_API.postman_collection.json # Postman collection
├── logs/                         # Log files directory
│   ├── 2025-09-27.log           # Daily log files
│   └── error.log                 # Error-specific log file
├── index.js                      # Entry point (starts the server)
├── package.json
├── package-lock.json
└── README.md                     # Setup and running instructions
```

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd game-club-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create data directory** (for SQLite database):
   ```bash
   mkdir data
   ```

## Running the Application

1. **Start the server**:
   ```bash
   npm start
   ```

2. **The server will start on port 3000** (or the port specified in the PORT environment variable)

3. **Verify the server is running**:
   - Visit: http://localhost:3000
   - Health check: http://localhost:3000/api/health

## API Endpoints

### Clubs

- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club by ID
- `POST /api/clubs` - Create new club
- `PUT /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club

### Events

- `GET /api/clubs/:id/events` - Get all events for a club
- `GET /api/clubs/:id/events/:eventId` - Get specific event
- `POST /api/clubs/:id/events` - Create new event for a club
- `PUT /api/clubs/:id/events/:eventId` - Update event
- `DELETE /api/clubs/:id/events/:eventId` - Delete event

### Other

- `GET /api/health` - Health check endpoint
- `GET /` - API information and available endpoints

## API Usage Examples

### Creating a Club

```bash
curl -X POST http://localhost:3000/api/clubs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Enthusiasts",
    "description": "A club for passionate gamers",
    "location": "Community Center"
  }'
```

### Creating an Event

```bash
curl -X POST http://localhost:3000/api/clubs/1/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Weekly Gaming Night",
    "description": "Join us for an evening of fun games",
    "event_date": "2024-01-15T18:00:00Z",
    "location": "Community Center Room A",
    "max_participants": 20
  }'
```

### Getting All Clubs

```bash
curl http://localhost:3000/api/clubs
```

## Data Models

### Club

```json
{
  "id": 1,
  "name": "Gaming Enthusiasts",
  "description": "A club for passionate gamers",
  "location": "Community Center",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Event

```json
{
  "id": 1,
  "club_id": 1,
  "title": "Weekly Gaming Night",
  "description": "Join us for an evening of fun games",
  "event_date": "2024-01-15T18:00:00Z",
  "location": "Community Center Room A",
  "max_participants": 20,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## Logging

The application includes a comprehensive logging system that tracks:

- **Request/Response Logging**: All HTTP requests and responses with timing information
- **Database Operations**: All database queries and operations
- **Validation Errors**: Input validation failures with detailed context
- **Business Logic**: Key business operations and their outcomes
- **Security Events**: Potential security issues and unauthorized access attempts
- **Error Tracking**: Detailed error information with stack traces

### Log Files

- **Daily Logs**: `logs/YYYY-MM-DD.log` - Contains all log entries for each day
- **Error Logs**: `logs/error.log` - Contains only error-level messages
- **Console Output**: All logs are also displayed in the console

### Log Levels

- **INFO**: General information about application flow
- **WARN**: Warning messages for potential issues
- **ERROR**: Error messages for failures and exceptions
- **DEBUG**: Detailed debugging information

## API Interface

### Postman Collection
- **File**: `docs/Game_Club_API.postman_collection.json`
- **Features**:
  - Complete API test suite
  - Environment variables
  - Sample requests and responses
  - Error testing scenarios
  - Automated testing capabilities

### API Documentation
- **File**: `docs/API_Documentation.md`
- **Features**:
  - Comprehensive endpoint documentation
  - Request/response examples
  - Error handling guide
  - Data model specifications
  - Testing instructions

### Validation Rules

#### Club Creation (`validateClubCreation`)
- **Name**: Required, max 100 characters, alphanumeric + basic punctuation only
- **Description**: Required, max 1000 characters, cannot be empty

#### Event Creation (`validateEventCreation`)
- **Title**: Required, max 100 characters, alphanumeric + basic punctuation only
- **Description**: Required, max 1000 characters, cannot be empty
- **Event Date**: Required, valid ISO 8601 format, cannot be in the past, max 2 years future

#### Club ID Parameter (`validateClubId`)
- **ID**: Required, must be positive integer

#### Search Parameters (`validateSearchParams`)
- **Search Term**: Optional, max 100 characters, alphanumeric + basic punctuation only

## Query Service

The API uses a centralized query service to manage all database operations, providing better organization and maintainability:

### Features
- **Centralized Queries**: All database operations in one place
- **Type Safety**: Proper parameter validation and return types
- **Comprehensive Logging**: All queries are logged with context
- **Reusable Methods**: Common operations can be reused across controllers
- **Error Handling**: Consistent error handling for database operations

### Query Classes

#### ClubQueries
- `getAllClubs(searchTerm)` - Get all clubs with optional search
- `getClubById(clubId)` - Get club by ID
- `clubExists(clubId)` - Check if club exists
- `findClubByName(name)` - Find club by name
- `createClub(clubData)` - Create new club
- `updateClub(clubId, updateData)` - Update club
- `deleteClub(clubId)` - Delete club

#### EventQueries
- `getEventsByClub(clubId)` - Get all events for a club
- `getEventById(eventId)` - Get event by ID
- `eventExists(eventId)` - Check if event exists
- `createEvent(eventData)` - Create new event
- `updateEvent(eventId, updateData)` - Update event
- `deleteEvent(eventId)` - Delete event
- `getEventsByClubPaginated(clubId, options)` - Get events with pagination
- `getUpcomingEvents(clubId, days)` - Get upcoming events

### Benefits
- **Separation of Concerns**: Controllers focus on HTTP logic, queries handle data
- **Maintainability**: Easy to update database operations
- **Testability**: Queries can be tested independently
- **Consistency**: Standardized query patterns across the application
- **Performance**: Optimized queries with proper logging


## Database

The application uses SQLite for data storage. The database file is automatically created in the `data/` directory when the server starts.

### Database Schema

**Clubs Table:**
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT NOT NULL)
- `description` (TEXT)
- `location` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**Events Table:**
- `id` (INTEGER PRIMARY KEY)
- `club_id` (INTEGER NOT NULL, FOREIGN KEY)
- `title` (TEXT NOT NULL)
- `description` (TEXT)
- `event_date` (DATETIME NOT NULL)
- `location` (TEXT)
- `max_participants` (INTEGER)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## Development

### Project Dependencies

- `express` - Web framework
- `sqlite3` - SQLite database driver
- `cors` - Cross-origin resource sharing

### Adding New Features

1. Create models in `src/models/`
2. Add controllers in `src/controllers/`
3. Define routes in `src/routes/`
4. Update validation in `src/services/validationService.js`

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT environment variable
2. **Database errors**: Ensure the `data/` directory exists and is writable
3. **Module not found**: Run `npm install` to install dependencies

### Logs

The application logs all requests and errors to the console. Check the console output for debugging information.

## License

This project is licensed under the MIT License.
