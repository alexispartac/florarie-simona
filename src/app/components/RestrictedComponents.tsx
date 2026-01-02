'use client';

import { usePathname } from "next/navigation";
import { NavbarDemo } from "./NavBar";
import React, { Suspense } from "react";
import { Loader } from "@mantine/core";

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
            {isRestricted ? children : <NavbarDemo>{children}</NavbarDemo>}
        </div>
    );
}

export function RestrictedComponents({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={
            <div className="h-screen w-full flex justify-center items-center">
                <Loader color="#b756a6" size="xl" />
            </div>
        }>
            <RestrictedContent>{children}</RestrictedContent>
        </Suspense>
    );
}