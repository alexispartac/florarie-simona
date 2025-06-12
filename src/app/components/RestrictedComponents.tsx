'use client';
import { usePathname } from "next/navigation";
import { NavbarDemo } from "./NavBar";

export const RestrictedComponents = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const restrictedPaths = ["/cart", "/checkout", "/admin"];
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