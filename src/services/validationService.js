// Validation service for input validation
class ValidationService {
  // Validate club data
  static validateClubData(data) {
    const errors = [];

    // Name validation
    if (
      !data.name ||
      typeof data.name !== 'string' ||
      data.name.trim().length === 0
    ) {
      errors.push('Name is required and must be a non-empty string');
    } else if (data.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }

    // Description validation
    if (data.description !== undefined && data.description !== null) {
      if (typeof data.description !== 'string') {
        errors.push('Description must be a string');
      } else if (data.description.length > 500) {
        errors.push('Description must be less than 500 characters');
      }
    }

    // Location validation
    if (data.location !== undefined && data.location !== null) {
      if (typeof data.location !== 'string') {
        errors.push('Location must be a string');
      } else if (data.location.length > 200) {
        errors.push('Location must be less than 200 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate event data
  static validateEventData(data) {
    const errors = [];

    // Title validation
    if (
      !data.title ||
      typeof data.title !== 'string' ||
      data.title.trim().length === 0
    ) {
      errors.push('Title is required and must be a non-empty string');
    } else if (data.title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }

    // Event date validation
    if (!data.event_date) {
      errors.push('Event date is required');
    } else {
      const eventDate = new Date(data.event_date);
      if (isNaN(eventDate.getTime())) {
        errors.push('Event date must be a valid date');
      } else if (eventDate < new Date()) {
        errors.push('Event date cannot be in the past');
      }
    }

    // Description validation
    if (data.description !== undefined && data.description !== null) {
      if (typeof data.description !== 'string') {
        errors.push('Description must be a string');
      } else if (data.description.length > 500) {
        errors.push('Description must be less than 500 characters');
      }
    }

    // Location validation
    if (data.location !== undefined && data.location !== null) {
      if (typeof data.location !== 'string') {
        errors.push('Location must be a string');
      } else if (data.location.length > 200) {
        errors.push('Location must be less than 200 characters');
      }
    }

    // Max participants validation
    if (data.max_participants !== undefined && data.max_participants !== null) {
      if (
        !Number.isInteger(data.max_participants) ||
        data.max_participants < 1
      ) {
        errors.push('Max participants must be a positive integer');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate ID parameter
  static validateId(id) {
    const errors = [];

    if (!id) {
      errors.push('ID is required');
    } else if (!Number.isInteger(parseInt(id)) || parseInt(id) <= 0) {
      errors.push('ID must be a positive integer');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Sanitize string input
  static sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return str.trim();
  }

  // Validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate URL format
  static validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

// Export individual functions for easier importing
const validateClubData = ValidationService.validateClubData;
const validateEventData = ValidationService.validateEventData;
const validateId = ValidationService.validateId;
const sanitizeString = ValidationService.sanitizeString;
const validateEmail = ValidationService.validateEmail;
const validateUrl = ValidationService.validateUrl;

module.exports = {
  ValidationService,
  validateClubData,
  validateEventData,
  validateId,
  sanitizeString,
  validateEmail,
  validateUrl,
};
