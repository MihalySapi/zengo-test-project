import { createContext, useContext, useState, type ReactNode } from "react";
import { Alert, Snackbar } from '@mui/material';

interface ErrorContextType {
  showError: (message: string) => void;
  clearError: () => void;
}

const GlobalErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider ({ children }: ErrorProviderProps) {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
  };

  const clearError = () => {
    setError(null);
  };

  const handleClose = () => {
    clearError();
  };

  return (
    <GlobalErrorContext.Provider value={{ showError, clearError }}>
      {children}
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert 
          onClose={handleClose} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%', minWidth: 300 }}
        >
          {error}
        </Alert>
      </Snackbar>
    </GlobalErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(GlobalErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};