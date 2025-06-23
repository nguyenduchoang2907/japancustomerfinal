
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const setError = (error: string | null) => {
    setErrorState(error);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, error, setError }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
