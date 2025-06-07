'use client';
import { Provider } from 'react-redux';
import { store } from './CartRedux';
import { useRef } from "react";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  
    const storeRef = useRef(store);
    return <Provider store={storeRef.current}>{children}</Provider>;
}

