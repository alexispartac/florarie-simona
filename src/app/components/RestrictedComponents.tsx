'use client';
import { usePathname } from "next/navigation";
import { NavbarDemo } from "./NavBar";
import React from "react";

export const RestrictedComponents = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const restrictedPaths = [
        "/",
        "/checkout",
        "/checkout/success",
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