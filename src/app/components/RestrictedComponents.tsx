'use client';
import { usePathname } from "next/navigation";
import { NavbarDemo } from "./NavBar";
import React, { useState, useEffect } from "react";
import { Loader } from "@mantine/core";

export const RestrictedComponents = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [showContent, setShowContent] = useState(false);

    const restrictedPaths = [
        "/",
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
        "/admin/close-period",
    ];
    const isRestricted = restrictedPaths.includes(pathname);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true); // Afișează conținutul după 3 secunde
        }, 2000);

        return () => clearTimeout(timer); // Curăță timer-ul la demontare
    }, []);

    if (!showContent) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <Loader />
            </div>
        );
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