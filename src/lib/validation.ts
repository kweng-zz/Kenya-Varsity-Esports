/**
 * Input validation utilities for API endpoints
 */

export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[];
  sanitize?: boolean;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationError {
  field: string;
  message: string;
  value: any;
}

/**
 * Validates input data against a schema
 * @param data - The data to validate
 * @param schema - The validation schema
 * @returns Object with isValid boolean and errors array
 */
export function validateInput(data: any, schema: ValidationSchema): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  for (const [field, rule] of Object.entries(schema)) {
    const value = data[field];

    // Check if required field is missing
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: `${field} is required`,
        value
      });
      continue;
    }

    // Skip validation if field is not required and is empty
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Type validation
    if (rule.type) {
      const typeError = validateType(value, rule.type, field);
      if (typeError) {
        errors.push(typeError);
        continue;
      }
    }

    // String validations
    if (typeof value === 'string') {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push({
          field,
          message: `${field} must be at least ${rule.minLength} characters long`,
          value
        });
      }

      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push({
          field,
          message: `${field} must not exceed ${rule.maxLength} characters`,
          value
        });
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push({
          field,
          message: `${field} format is invalid`,
          value
        });
      }

      // Email validation
      if (rule.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          errors.push({
            field,
            message: `${field} must be a valid email address`,
            value
          });
        }
      }

      // URL validation
      if (rule.type === 'url') {
        try {
          new URL(value);
        } catch {
          errors.push({
            field,
            message: `${field} must be a valid URL`,
            value
          });
        }
      }

      // Sanitize string values
      if (rule.sanitize) {
        data[field] = sanitizeString(value);
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push({
          field,
          message: `${field} must be at least ${rule.min}`,
          value
        });
      }

      if (rule.max !== undefined && value > rule.max) {
        errors.push({
          field,
          message: `${field} must not exceed ${rule.max}`,
          value
        });
      }
    }

    // Array validations
    if (Array.isArray(value)) {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push({
          field,
          message: `${field} must contain at least ${rule.minLength} items`,
          value
        });
      }

      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push({
          field,
          message: `${field} must not contain more than ${rule.maxLength} items`,
          value
        });
      }
    }

    // Enum validation
    if (rule.enum && !rule.enum.includes(value)) {
      errors.push({
        field,
        message: `${field} must be one of: ${rule.enum.join(', ')}`,
        value
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateType(value: any, type: string, field: string): ValidationError | null {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return {
          field,
          message: `${field} must be a string`,
          value
        };
      }
      break;
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        return {
          field,
          message: `${field} must be a number`,
          value
        };
      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean') {
        return {
          field,
          message: `${field} must be a boolean`,
          value
        };
      }
      break;
    case 'array':
      if (!Array.isArray(value)) {
        return {
          field,
          message: `${field} must be an array`,
          value
        };
      }
      break;
    case 'object':
      if (typeof value !== 'object' || Array.isArray(value) || value === null) {
        return {
          field,
          message: `${field} must be an object`,
          value
        };
      }
      break;
  }
  return null;
}

/**
 * Sanitizes string input to prevent XSS
 * @param str - The string to sanitize
 * @returns Sanitized string
 */
function sanitizeString(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  email: {
    email: {
      required: true,
      type: 'email' as const,
      maxLength: 255,
      sanitize: true
    }
  },
  
  contactMessage: {
    name: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      maxLength: 200,
      sanitize: true
    },
    email: {
      required: true,
      type: 'email' as const,
      maxLength: 255,
      sanitize: true
    },
    message: {
      required: true,
      type: 'string' as const,
      minLength: 10,
      maxLength: 2000,
      sanitize: true
    },
    type: {
      required: true,
      type: 'string' as const,
      enum: ['partnership', 'press', 'general'],
      sanitize: true
    }
  },

  newsletterSubscription: {
    email: {
      required: true,
      type: 'email' as const,
      maxLength: 255,
      sanitize: true
    },
    tags: {
      required: false,
      type: 'array' as const,
      maxLength: 10
    }
  },

  rankingEntry: {
    rank: {
      required: true,
      type: 'number' as const,
      min: 1
    },
    playerName: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      maxLength: 100,
      sanitize: true
    },
    universityId: {
      required: true,
      type: 'string' as const,
      maxLength: 50,
      sanitize: true
    },
    categoryId: {
      required: true,
      type: 'string' as const,
      maxLength: 50,
      sanitize: true
    }
  }
};