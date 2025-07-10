'use client';
import { createContext, useState, useContext } from 'react';
import { ReactNode } from 'react';
import { CookiesProvider } from 'react-cookie';

export interface User {
    userInfo : {
        id: string;
        name: string;
        surname: string;
        email: string;
        password: string;
        phone?: string;
        address?: string;
        order?: number;
        createdAt?: string;
        avatar?: string; 
    }
    isAuthenticated: boolean;
}

export interface UserContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
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
            order: 0,
            createdAt: '',
            avatar: '',
        },
        isAuthenticated: false,
    },
    setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({
        userInfo : {
            id: '',
            name: '',
            surname: '',
            password: '',
            email: '',
            phone: '',
            address: '',
            order: 0,
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