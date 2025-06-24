'use client';
import { usePathname } from "next/navigation";
import { NavbarDemo } from "./NavBar";
import React, { useState, useEffect } from "react";

export const RestrictedComponents = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [showContent, setShowContent] = useState(false);

    const restrictedPaths = [
        "/cart",
        "/checkout",
        "/admin",
        "/admin/products",
        "/admin/products-composed",
        "/admin/orders",
        "/admin/users",
        "/admin/statistics",
        "/admin/clients",
        "/admin/settings",
    ];
    const isRestricted = restrictedPaths.includes(pathname);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true); // Afișează conținutul după 3 secunde
        }, 2000);

        return () => clearTimeout(timer); // Curăță timer-ul la demontare
    }, []);

    if (!showContent) {
        return <div>Se încarcă...</div>; // Mesaj de încărcare
    }

    return (
        <div>
            {isRestricted ? (
                <div>{children}</div>
            ) : (
                <div>
                    <NavbarDemo>{children}</NavbarDemo>
                </div>
            )}
        </div>
    );
};