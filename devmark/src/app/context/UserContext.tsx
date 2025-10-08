'use client';

import { createContext, useContext, ReactNode } from 'react';

interface UserContextProps {
  userId: string | null;
}

const UserContext = createContext<UserContextProps>({ userId: null });

export const UserProvider = ({ userId, children }: { userId: string | null, children: ReactNode }) => {
  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
