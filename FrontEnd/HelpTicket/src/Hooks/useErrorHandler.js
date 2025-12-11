import { useContext } from 'react';
import { ErrorContext } from '../Contexts/ErrorContext';
import { formatErrorMessage, logError } from '../API/ErrorHandler';

/**
 * Custom hook for error handling in components
 * @returns {object} { handleError, addError, removeError, clearAllErrors }
 */
export function useErrorHandler() {
  const { addError, removeError, clearAllErrors } = useContext(ErrorContext);

  const handleError = (error, context = 'operasjon') => {
    const message = formatErrorMessage(error, context);
    logError(error, context);
    addError(message);
  };

  return {
    handleError,
    addError,
    removeError,
    clearAllErrors,
  };
}
