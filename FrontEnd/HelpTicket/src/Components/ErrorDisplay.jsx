import { useContext } from 'react';
import { ErrorContext } from '../Contexts/ErrorContext';

export function ErrorDisplay() {
  const { errors, removeError } = useContext(ErrorContext);

  return (
    <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
      {errors.map(error => (
        <div
          key={error.id}
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '10px',
            minWidth: '300px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error.message}</span>
            <button
              onClick={() => removeError(error.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#721c24',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
