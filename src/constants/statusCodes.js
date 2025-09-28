// HTTP Status Codes Constants
const HTTP_STATUS = {
  // Success responses
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Status code messages
const STATUS_MESSAGES = {
  [HTTP_STATUS.OK]: 'OK',
  [HTTP_STATUS.CREATED]: 'Created',
  [HTTP_STATUS.ACCEPTED]: 'Accepted',
  [HTTP_STATUS.NO_CONTENT]: 'No Content',
  [HTTP_STATUS.BAD_REQUEST]: 'Bad Request',
  [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized',
  [HTTP_STATUS.FORBIDDEN]: 'Forbidden',
  [HTTP_STATUS.NOT_FOUND]: 'Not Found',
  [HTTP_STATUS.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [HTTP_STATUS.CONFLICT]: 'Conflict',
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too Many Requests',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HTTP_STATUS.NOT_IMPLEMENTED]: 'Not Implemented',
  [HTTP_STATUS.BAD_GATEWAY]: 'Bad Gateway',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [HTTP_STATUS.GATEWAY_TIMEOUT]: 'Gateway Timeout',
};

// Custom error messages for the Game Club API
const API_MESSAGES = {
  // Club related messages
  CLUB_CREATED: 'Club created successfully',
  CLUB_NOT_FOUND: 'Club not found',
  CLUB_NAME_EXISTS: 'A club with this name already exists',
  CLUB_NAME_REQUIRED: 'Club name is required',
  CLUB_DESCRIPTION_REQUIRED: 'Club description is required',

  // Event related messages
  EVENT_CREATED: 'Event created successfully',
  EVENT_NOT_FOUND: 'Event not found',
  EVENT_TITLE_REQUIRED: 'Event title is required',
  EVENT_DESCRIPTION_REQUIRED: 'Event description is required',
  EVENT_DATE_REQUIRED: 'Event date/time is required',
  EVENT_DATE_INVALID: 'Invalid event date format',

  // General messages
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  ROUTE_NOT_FOUND: 'Route not found',
  DATABASE_ERROR: 'Database error',
  SUCCESS: 'Success',
};

// Helper function to get status message
const getStatusMessage = (statusCode) => {
  return STATUS_MESSAGES[statusCode] || 'Unknown Status';
};

// Helper function to create standardized error response
const createErrorResponse = (statusCode, message, details = {}) => {
  return {
    success: false,
    error: getStatusMessage(statusCode),
    message: message,
    ...details,
  };
};

// Helper function to create standardized success response
const createSuccessResponse = (data = null, message = null, meta = {}) => {
  const response = {
    success: true,
    ...meta,
  };

  if (message) {
    response.message = message; 
  }

  if (data !== null) {
    response.data = data;
  }

  return response;
};

// Validation error helper
const createValidationError = (field, message) => {
  return createErrorResponse(
    HTTP_STATUS.BAD_REQUEST,
    API_MESSAGES.VALIDATION_FAILED,
    { field, validationError: message }
  );
};

// Not found error helper
const createNotFoundError = (resource, id = null) => {
  const message = id
    ? `${resource} with ID ${id} not found`
    : `${resource} not found`;
  return createErrorResponse(HTTP_STATUS.NOT_FOUND, message);
};

// Conflict error helper
const createConflictError = (message) => {
  return createErrorResponse(HTTP_STATUS.CONFLICT, message);
};

// Internal server error helper
const createInternalError = (
  message = API_MESSAGES.INTERNAL_ERROR,
  error = null
) => {
  const response = createErrorResponse(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message
  );

  if (error && process.env.NODE_ENV === 'development') {
    response.errorDetails = error.message;
    response.stack = error.stack;
  }

  return response;
};

module.exports = {
  HTTP_STATUS,
  STATUS_MESSAGES,
  API_MESSAGES,
  getStatusMessage,
  createErrorResponse,
  createSuccessResponse,
  createValidationError,
  createNotFoundError,
  createConflictError,
  createInternalError,
};
