"use client";
import React from "react";
import PopUp from "../components/PopUp";
import { Footer } from "../components/Footer";
import { Anchor, Loader } from '@mantine/core';
import { ComposedProductProps } from "@/app/types/products";
import { ContinerItems } from "../components/Products";
import { useProductsGroupedByCategory } from "../components/hooks/fetchProductsGroupedByCategory";

const itemsBread = [
    { title: 'Buchetul Simonei', href: '/homepage' }
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

    const items = Object.entries(groupedProducts).reduce((acc: ComposedProductProps[], [category, products]) => {
        if (category.includes('Eveniment')) {
            acc.push(...(products as ComposedProductProps[]));
        }
        return acc;
    }, [] as ComposedProductProps[]);
    
    return (
        <div className="relative container mx-auto pt-24">
            <div className="flex justify-center py-3">
                <p className="font-extrabold text-gray-500 px-3 text-center">
                    Comandă flori cadou online cu livrare în aceeași zi – rapid și simplu!  
                </p>
            </div>
            <ContinerItems items={items} itemsBread={itemsBread} />
        </div>
    );
};


const OccasionAndEvents = () => {
  
  return (
    <div className={`relative w-full var(--background)`}>
        <PopUp />
        <Content />
        <Footer />
    </div>
  )
}

export default OccasionAndEvents;