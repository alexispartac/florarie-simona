"use client";
import { cn } from "../lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "motion/react";
import Link from "next/link";
import React, { useRef, useState } from "react";


interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
        category: {
            name?: string;
            link?: string;
        }[];
    }[];
    visible?: boolean;
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    items: { name: string, link: string, category: { name: string, link: string }[] }[];
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [visible, setVisible] = useState<boolean>(false);
    
    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            className={cn("sticky inset-x-0 top-20 z-40 w-full", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    )
                    : child,
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "40%" : "100%",
                y: visible ? 20 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            style={{
                minWidth: "800px",
            }}
            className={cn(
                "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-0.5 lg:flex dark:bg-transparent",
                visible && "bg-white/80 dark:custom",
                !visible && "color-theme dark:custom",

                className,
            )}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child) && child.type !== "div"
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    )
                    : child,
            )}
        </motion.div>
    );
};

export const NavItems = ({ items, className, onItemClick, visible }: NavItemsProps) => {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
                className,
            )}
        >
            {
                items.map((item, idx: number) => (
                    !visible ?
                        <div
                            key={`link-${idx}`}
                        >
                            <Link
                                onMouseEnter={() => setHovered(idx)}
                                onClick={onItemClick}
                                className="relative px-4 py-2 custom dark:text-neutral-300"
                                href={`/${item.link}`}
                            >
                                {hovered === idx && idx > 4 && (
                                    <motion.div
                                        layoutId="hovered"
                                        className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:white"
                                    />
                                )}
                                <span className="relative z-20">{item.name}</span>
                            </Link>
                            {hovered === idx && idx < 5 && (
                                <motion.div
                                    layoutId="hovered"
                                    className="absolute color-tooltip text-[100%] flex flex-col text-start text-xl font-serif top-[52px] px-5 py-4 w-80 h-[200px] bg-white shadow-md dark:white "
                                >
                                    {
                                        item.category?.map((category, idx) => (
                                            <Link key={idx} className="py-[4px]" href={`/${item.link}/${category.name}`}>{category.name}</Link>
                                        ))
                                    }
                                </motion.div>
                            )}
                        </div>
                        : 
                        null
                ))
            }
        </motion.div>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "90%" : "100%",
                paddingRight: visible ? "12px" : "0px",
                paddingLeft: visible ? "12px" : "0px",
                borderRadius: visible ? "4px" : "2rem",
                y: visible ? 20 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 lg:hidden",
                visible && "bg-white/80 dark:color-theme",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    items,
    className,
    isOpen,
    onClose,
}: MobileNavMenuProps) => {
    const [hovered, setHovered] = useState<number | null>(null);
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                        "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:color-theme",
                        className,
                    )}
                >
                    {
                        items.map((item, idx) => (
                            <div
                                onMouseLeave={() => setHovered(null)}
                                key={`mobile-link-${idx}`}
                            >
                                <Link
                                    onMouseEnter={() => setHovered(idx)}
                                    href={`/${item.link}`}
                                    className="relative text-neutral-800 dark:text-neutral-600"
                                >
                                    <span className="block">{item.name}</span>
                                </Link>
                                {hovered === idx && idx < 5 && (
                                    <motion.div
                                        layoutId="hovered"
                                        className="relative text-[100%] flex flex-col text-start font-serif px-5 py-3 w-full bg-white dark:white "
                                    >
                                        {
                                            item.category?.map((category, idx) => (
                                                <Link key={idx} onClick={() => onClose()} className="py-[4px]" href={`/${category.link}/${category.name}`}>{category.name}</Link>
                                            ))
                                        }
                                    </motion.div>
                                )}
                            </div>
                        ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return isOpen ? (
        <IconX className="text-black dark:color-theme" onClick={onClick} size={28} />
    ) : (
        <IconMenu2 className="text-black dark:color-theme" onClick={onClick} size={28} />
    );
};

export const NavbarLogo = () => {
    return (
        <Link
            
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 text-sm font-normal text-black" href={"/"} >
            <img src="/logo.jpg" className="w-20 h-12" alt="logo" />
        </Link>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
        | React.ComponentPropsWithoutRef<"a">
        | React.ComponentPropsWithoutRef<"button">
    )) => {
    const baseStyles =
        "px-4 py-2 rounded-md button bg-transparent text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

    const variantStyles = {
        primary:
            "important shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        secondary: "custom bg-transparent shadow-none dark:text-white",
        dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        gradient:
            "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
    };

    return (
        <Tag
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </Tag>
    );
};
