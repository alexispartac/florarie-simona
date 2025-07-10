'use client';

import React from "react";
import { useStore } from "../context/StoreContext";

export default function AnimateForBegin() {
    const [show, setShow] = React.useState(true);
    const { isClosed } = useStore();

    React.useEffect(() => {
        if (isClosed) {
            setShow(false);
        } else {
            const timer = setTimeout(() => {
                setShow(false);
            }, 3000); 

            return () => clearTimeout(timer);
        }
    }, [isClosed]);


    return (
        show &&
        <div className="flower-loader">
            <div className="flower">
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={`petal petal-${i-1}`}></div>
                ))}
                <div className="center"></div>
            </div>
            <div className="w-[50%] md:w-[20%] flex justify-center items-center mt-4">
                <img src="/logo.jpg" alt="Logo" className="logo" />
            </div>
        </div>
  );
}