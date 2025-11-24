"use client";
import { Navbar, NavBody, NavItems, MobileNav, NavbarLogo, MobileNavHeader, MobileNavToggle, MobileNavMenu } from "../components/ui/resizable-navbar";
import React, { useEffect, useState } from "react";
import { CallModal } from "./CallModal";
import { AuthModal } from "./Auth";
import axios from "axios";
import SearchBar from "./SearchBar";
import Filter from "./Filter";

const URL_COMPOSED_CATEGORIES = '/api/products-composed-categories';

export function NavbarDemo({ children }: { children: React.ReactNode }) {
  const [composedCategories, setComposedCategories] = useState<{ name: string, link: string }[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  useEffect(() => {
    const fetchComposedCategories = async () => {
      try {
        const response = await axios.get(URL_COMPOSED_CATEGORIES);
        if (response.status === 200) {
          setComposedCategories(response.data);
        }
      } catch (error) {
        console.log('Error fetching composed categories', error);
      }
    };
    fetchComposedCategories();
  }, []);

  const groupCategoriesByLink = (categories: { name: string; link: string }[]) => {
    const grouped: Record<string, { name: string; link: string }[]> = {};

    categories.forEach((category) => {
      if (!grouped[category.link]) {
        grouped[category.link] = [];
      }
      grouped[category.link].push(category);
    });

    return grouped;
  };

  const groupedCategories = groupCategoriesByLink(composedCategories);

  const navItems: { name: string, link: string, category: { name: string, link: string }[] }[] = [
    {
      name: "Buchete",
      link: "bouquets",
      category: groupedCategories["bouquets"] || [],
    },
    {
      name: "Aranjamente",
      link: "arrangements",
      category: groupedCategories["arrangements"] || [],
    },
    {
      name: "Ocazii",
      link: "occasion&events",
      category: groupedCategories["occasion&events"] || [],
    },
    {
      name: "Cadouri",
      link: "gifts",
      category: groupedCategories["gifts"] || [],
    },
    {
      name: "Organizare evenimente",
      link: "event-planning",
      category: [],
    },
    {
      name: "Despre noi",
      link: "about-us",
      category: [],
    },
    {
      name: "Contact",
      link: "contact",
      category: [],
    },
  ];

  return (
    <div className={`relative w-full var(--background)`}>
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <SearchBar />
            <Filter />
            <AuthModal />
            <CallModal />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex w-full flex-row justify-end items-center">
              <SearchBar />
              <Filter />
              <AuthModal />
              <CallModal />
            </div>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            items={navItems}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNav>
      </Navbar>
      {children}
    </div>
  );
}
