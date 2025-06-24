/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode } from 'react';

interface UserContextType {
    userId: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Named export 추가
export { UserContext };

interface UserProviderProps {
    children: ReactNode;
    userId: string;
}

export const UserProvider = ({ children, userId }: UserProviderProps) => {
    return <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
