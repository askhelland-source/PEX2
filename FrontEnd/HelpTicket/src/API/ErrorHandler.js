/**
 * Centralized Error Handler
 * Standardizes error messages and logging across the application
 */

export const ErrorTypes = {
  FETCH: 'FETCH',
  VALIDATION: 'VALIDATION',
  SERVER: 'SERVER',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNKNOWN: 'UNKNOWN',
};

/**
 * Process and standardize error messages
 * @param {Error} error - The error object
 * @param {string} context - What action was being performed (e.g., "opprette sak", "slette sak")
 * @returns {string} User-friendly error message
 */
export const formatErrorMessage = (error, context = 'operasjon') => {
  if (!error) return `Ukjent feil under ${context}`;

  // If it's already a formatted string
  if (typeof error === 'string') {
    return error;
  }

  // Extract message from error object
  const message = error.message || error.toString();

  // Check for common patterns
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return `Nettverksfeil under ${context}. Sjekk internettforbindelsen.`;
  }

  if (message.includes('404') || message.includes('not found')) {
    return `Saken ble ikke funnet. Den kan være slettet.`;
  }

  if (message.includes('500') || message.includes('Server')) {
    return `Serverfeil under ${context}. Prøv igjen senere.`;
  }

  return `Feil under ${context}: ${message}`;
};

/**
 * Log error to console with context
 * @param {Error} error
 * @param {string} context
 */
export const logError = (error, context = 'Error') => {
  console.error(`[${context}]`, error);
};

/**
 * Show user-friendly error alert
 * @param {Error} error
 * @param {string} context - What action was being performed
 */
export const showErrorAlert = (error, context = 'operasjon') => {
  const message = formatErrorMessage(error, context);
  alert(message);
};

/**
 * Determine error type for advanced handling
 * @param {Error} error
 * @returns {string} ErrorType
 */
export const getErrorType = (error) => {
  if (!error) return ErrorTypes.UNKNOWN;

  const message = error.message || error.toString();

  if (message.includes('404')) return ErrorTypes.NOT_FOUND;
  if (message.includes('409')) return ErrorTypes.CONFLICT;
  if (message.includes('500') || message.includes('Server')) return ErrorTypes.SERVER;
  if (message.includes('NetworkError') || message.includes('Failed to fetch')) return ErrorTypes.FETCH;
  if (message.includes('validation') || message.includes('invalid')) return ErrorTypes.VALIDATION;

  return ErrorTypes.UNKNOWN;
};
