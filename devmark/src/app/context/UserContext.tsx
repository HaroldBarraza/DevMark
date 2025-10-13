'use client';

import { createContext, useContext, ReactNode } from 'react';

interface UserContextProps {
  userId: string | null;
}

/**
 * UserContext provides user authentication state throughout the application
 * Contains the current user's ID or null if not authenticated
 */
const UserContext = createContext<UserContextProps>({ userId: null });

/**
 * UserProvider component that wraps the application with user context
 * @param userId - The current user's ID or null if not authenticated
 * @param children - Child components that will have access to user context
 */
export const UserProvider = ({ 
  userId, 
  children 
}: { 
  userId: string | null; 
  children: ReactNode 
}) => {
  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to access user context
 * @returns UserContextProps with current user ID
 * @throws Error if used outside of UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};