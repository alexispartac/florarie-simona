"use client";
import React from "react";
import { Anchor, Loader } from '@mantine/core';
import { Footer } from "../components/Footer";
import { NavbarDemo } from "../components/NavBar";
import PopUp from "../components/PopUp";
import { ContinerItems } from "../components/Products";
import { ItemProps } from "../types";
import { useProductsGroupedByCategory } from "../components/hooks/fetchProductsGroupedByCategory";

const itemsBread = [
    { title: 'Buchetul Simonei', href: '/' },
    { title: 'Cadouri', href: 'gifts' },
].map((item, index) => (
    <Anchor c={"#b756a6"} href={item.href} key={index}>
            {item.title}
    </Anchor>
));

const Content = () => {
    const { data: groupedProducts, isLoading, isError } = useProductsGroupedByCategory();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>A apărut o eroare la încărcarea produselor.</p>
            </div>
        );
    }

    const items = Object.entries(groupedProducts).reduce((acc: ItemProps[], [category, products]) => {
        if (category.includes('Cadou')) {
            acc.push(...(products as ItemProps[]));
        }
        return acc;
    }, [] as ItemProps[]);
    
    return (
        <div className="relative container mx-auto pt-24">
            <div className="flex justify-center py-3">
                <p className="font-extrabold text-gray-500 text-center">
                    Comandă flori cadou online cu livrare în aceeași zi – rapid și simplu!  
                </p>
            </div>
            <ContinerItems items={items} itemsBread={itemsBread} />
            <Footer />
        </div>
    );
};

const Gifts = () => {
    
  return (
    <div className={`relative w-full var(--background)`}>
        <PopUp />
        <NavbarDemo>
            <Content />
        </NavbarDemo>
    </div>
  )
}

export default Gifts;