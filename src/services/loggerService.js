const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = this.getTimestamp();
    const metaString =
      Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
  }

  writeToFile(filename, message) {
    const logFile = path.join(this.logDir, filename);
    fs.appendFileSync(logFile, message + '\n');
  }

  log(level, message, meta = {}) {
    const formattedMessage = this.formatMessage(level, message, meta);

    // Console output
    console.log(formattedMessage);

    // File output
    const today = new Date().toISOString().split('T')[0];
    this.writeToFile(`${today}.log`, formattedMessage);

    // Error-specific file
    if (level === 'error') {
      this.writeToFile('error.log', formattedMessage);
    }
  }

  // Log levels
  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  // Specific logging methods for API operations
  request(req, res, responseTime) {
    const meta = {
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    };

    const level = res.statusCode >= 400 ? 'warn' : 'info';
    this.log(level, `${req.method} ${req.url} - ${res.statusCode}`, meta);
  }

  database(operation, table, details = {}) {
    const meta = {
      operation,
      table,
      ...details,
    };
    this.info(`Database ${operation} on ${table}`, meta);
  }

  validation(field, value, error) {
    const meta = {
      field,
      value: typeof value === 'string' ? value.substring(0, 100) : value,
      error,
    };
    this.warn(`Validation failed for field: ${field}`, meta);
  }

  businessLogic(operation, entity, details = {}) {
    const meta = {
      operation,
      entity,
      ...details,
    };
    this.info(`Business logic: ${operation} ${entity}`, meta);
  }

  security(event, details = {}) {
    const meta = {
      event,
      ...details,
    };
    this.warn(`Security event: ${event}`, meta);
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;
