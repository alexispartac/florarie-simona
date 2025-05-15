"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../components/ui/resizable-navbar";
import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export function NavbarDemo({ children } : { children: React.ReactNode}) {
  const navItems = [
      {
          name: "Buchete",
          link: "bouquets",
          category: [
              {
                  name: "Buchete de aniversare",
                  link: "bouquets/anniversary",
              },
              {
                  name: "Buchete de graduatie",
                  link: "bouquets/graduation",
              },
              {
                  name: "Buchete personalizate",
                  link: "bouquets/custom",
              },
          ]
      },
      {
          name: "Aranjamente florale",
          link: "arrangements",
          category: [
              {
                  name: "Aranjamente florale personalizate",
                  link: "arrangements/custom",
              },
          ]
      },
      {
          name: "Ocazii si evenimente",
          link: "occasion&events",
          category: [
              {
                  name: "Ocazii si evenimente personalizate",
                  link: "occasion&events/custom",
              },
          ]
      },
      {
          name: "Cadouri",
          link: "gifts",
          category: [
              {
                  name: "Cadouri personalizate",
                  link: "gifts/custom",
              },
          ]
      },
      {
          name: "Noutati",
          link: "features",
          category: []
      },
      {
          name: "Despre",
          link: "about",
          category: []
      },
      {
          name: "Contact",
          link: "contact",
          category: []
      },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className={`relative w-full var(--background)`}>
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Sună-mă</NavbarButton>
          </div>
        </NavBody>
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <div
                onMouseLeave={() => setHovered(null)}
                key={`mobile-link-${idx}`}
              >
                <Link
                  onMouseEnter={() => setHovered(idx)}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-800 dark:text-neutral-600"
                >
                  <span className="block">{item.name}</span>
                </Link>
                {hovered === idx && idx < 4 && (
                  <motion.div
                    layoutId="hovered"
                    className="relative font-extrabold text-[100%] flex flex-col text-start font-serif px-5 py-3 w-full bg-white dark:white "
                  >
                    {
                      item.category?.map((category, idx) => (
                        <Link key={idx} className="py-[4px]" href={`/${item.link}/${category.name}`}>{category.name}</Link>
                      ))
                    }
                  </motion.div>
                )}
              </div>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {children}
    </div>
  );
}
