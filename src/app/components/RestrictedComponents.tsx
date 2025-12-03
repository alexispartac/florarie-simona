'use client';

import { usePathname } from "next/navigation";
import { NavbarDemo } from "./NavBar";
import React, { Suspense } from "react";

function RestrictedContent({ children }: { children: React.ReactNode }) {
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
        "/admin/newsletter",
    ];
    const isRestricted = restrictedPaths.includes(pathname || '');

    return (
        <div>
            {isRestricted ? <NavbarDemo>{children}</NavbarDemo> : children}
        </div>
    );
}

export function RestrictedComponents({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div>Se încarcă...</div>}>
            <RestrictedContent>{children}</RestrictedContent>
        </Suspense>
    );
}