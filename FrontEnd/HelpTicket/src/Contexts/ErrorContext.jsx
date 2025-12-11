import { createContext, useState, useCallback } from 'react';

export const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [errors, setErrors] = useState([]);

  const addError = useCallback((message, id = null) => {
    const errorId = id || Date.now();
    const error = {
      id: errorId,
      message,
      timestamp: new Date(),
    };
    
    setErrors(prev => [...prev, error]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeError(errorId);
    }, 5000);

    return errorId;
  }, []);

  const removeError = useCallback((id) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearAllErrors }}>
      {children}
    </ErrorContext.Provider>
  );
}
