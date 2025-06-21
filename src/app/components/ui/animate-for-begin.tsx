'use client';

import React from "react";

export default function AnimateForBegin() {
    const [show, setShow] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 2000); // Hide after 3 seconds

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, []);


    return (
        show &&
        <div className="flower-loader">
            <div className="flower">
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={`petal petal-${i-1}`}></div>
                ))}
                <div className="center"></div>
            </div>
            {/* vreau sa coboare logoul cu motion.div sub floare */}
            <div className="w-[50%] md:w-[20%] flex justify-center items-center mt-4">
                <img src="/logo.jpg" alt="Logo" className="logo" />
            </div>
        </div>
  );
}