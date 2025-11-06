'use client';
import { createContext, useState, useContext } from 'react';
import { ReactNode } from 'react';
import { CookiesProvider } from 'react-cookie';
import { User } from '@/app/types/user';

export interface UserContext {
    userInfo : User,
    isAuthenticated: boolean;
}

export interface UserContextType {
    user: UserContext;
    setUser: React.Dispatch<React.SetStateAction<UserContext>>;
}

const UserContext = createContext<UserContextType>({
    user: {
        userInfo : {
            id: '',
            email: '',
            name: '',
            surname: '',
            password: '',
            phone: '',
            address: '',
            orders: 0,
            createdAt: '',
            avatar: '',
        },
        isAuthenticated: false,
    },
    setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserContext>({
        userInfo : {
            id: '',
            name: '',
            surname: '',
            password: '',
            email: '',
            phone: '',
            address: '',
            orders: 0,
            createdAt: '',
            avatar: '',
        },
        isAuthenticated: false,
    });

    return (
        <UserContext.Provider value={{ user, setUser}}>
          <CookiesProvider>
            {children}
          </CookiesProvider>
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};