'use client';
import { usePathname } from "next/navigation";
import { NavbarDemo } from "./NavBar";

export const RestrictedComponents = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const restrictedPaths = ["/cart", "/checkout", "/admin", "/admin/products", "/admin/products-composed", "/admin/orders", "/admin/users", "/admin/statistics", "/admin/settings"];
    const isRestricted = restrictedPaths.includes(pathname);

    return (
        <div>
            {isRestricted ? (
                <div>{children}</div>
            ) : (
                <div>
                    <NavbarDemo>
                        {children}
                    </NavbarDemo>
                </div>
            )}
        </div>
    );
}