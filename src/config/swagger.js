const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Game Club API',
      version: '1.0.0',
      description: 'A RESTful API for managing game clubs and their events',
      contact: {
        name: 'Game Club API Support',
        email: 'support@gameclubapi.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Club: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the club',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Name of the club',
              example: 'Gaming Enthusiasts',
              maxLength: 100
            },
            description: {
              type: 'string',
              description: 'Description of the club',
              example: 'A club for passionate gamers'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the club was created'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the club was last updated'
            }
          }
        },
        Event: {
          type: 'object',
          required: ['title', 'description', 'event_date'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the event',
              example: 1
            },
            club_id: {
              type: 'integer',
              description: 'ID of the club this event belongs to',
              example: 1
            },
            title: {
              type: 'string',
              description: 'Title of the event',
              example: 'Weekly Gaming Night',
              maxLength: 100
            },
            description: {
              type: 'string',
              description: 'Description of the event',
              example: 'Join us for an evening of gaming and fun'
            },
            event_date: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time of the event',
              example: '2024-12-31T18:00:00Z'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the event was created'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the event was last updated'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Bad Request'
            },
            message: {
              type: 'string',
              example: 'Validation failed'
            },
            field: {
              type: 'string',
              example: 'name',
              description: 'Field that caused the validation error'
            },
            validationError: {
              type: 'string',
              example: 'Club name is required',
              description: 'Specific validation error message'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Clubs',
        description: 'Operations related to game clubs'
      },
      {
        name: 'Events',
        description: 'Operations related to club events'
      },
      {
        name: 'Health',
        description: 'Health check endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
