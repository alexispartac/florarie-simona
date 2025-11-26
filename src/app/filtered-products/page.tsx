"use client";
import React from "react";
import PopUp from "../components/PopUp";
import { Footer } from "../components/Footer";
import { Anchor, Loader } from '@mantine/core';
import { ComposedProductProps } from "@/app/types/products";
import { ContinerItems } from "../components/Products";
import { useAllProducts } from "../components/hooks/fetchProductsGroupedByCategory";
import { useFilters } from "../components/context/FiltersContext";

const itemsBread = [
    { title: 'Buchetul Simonei', href: '/homepage' }
].map((item, index) => (
    <Anchor c={"#b756a6"} href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const Content = () => {
    const { data: products, isLoading, isError } = useAllProducts();
    const { filters } = useFilters();

    if (!products) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>A apărut o eroare la încărcarea produselor.</p>
            </div>
        );
    }

    const filteredProducts = products.filter((product: ComposedProductProps) => {
        const categoryMatch = filters.filter.category.length === 0 ||
            filters.filter.category.includes(product.category);

        const colors: string[] = product.colors.split(',');

        const colorsMatch = filters.filter.colors.length === 0 ||
            colors.some(color => filters.filter.colors.includes(color));

        const priceMatch = (filters.filter.price_min === 0 ||
            product.info_category.standard.price >= filters.filter.price_min) &&
            (filters.filter.price_max === 0 ||
                product.info_category.standard.price <= filters.filter.price_max);

        const promotionMatch = !filters.filter.promotion || product.promotion === true;
        const popularMatch = !filters.filter.popular || product.isPopular === true;

        return categoryMatch && colorsMatch && priceMatch && promotionMatch && popularMatch;
    });

    let orderedProducts = [...filteredProducts];

    if (filters.sorter === "Pret crescator") {
        orderedProducts = filteredProducts.sort((a: ComposedProductProps, b: ComposedProductProps) => {
            if (filters.sorter === "Pret crescator") {
                return a.info_category.standard.price - b.info_category.standard.price;
            } else if (filters.sorter === "Pret descrescator") {
                return b.info_category.standard.price - a.info_category.standard.price;
            }
            return 0;
        });
    }

    if (filters.sorter === "Cea mai mare promotie") {
        orderedProducts = filteredProducts.sort((a: ComposedProductProps, b: ComposedProductProps) => {
            const promotionA = a.promotion === true;
            const promotionB = b.promotion === true;

            if (promotionA && !promotionB) {
                return -1;
            } else if (!promotionA && promotionB) {
                return 1;
            }
            return 0;
        });
    }

    if (filters.sorter === "Cele mai populare") {
        orderedProducts = filteredProducts.sort((a: ComposedProductProps, b: ComposedProductProps) => {
            const popularA = a.isPopular === true;
            const popularB = b.isPopular === true;

            if (popularA && !popularB) {
                return -1;
            } else if (!popularA && popularB) {
                return 1;
            }
            return 0;
        });
    }

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

    return (
        <div className="relative container mx-auto pt-24">
            <div className="flex justify-center py-3">
                <p className="font-extrabold text-gray-500 px-3 text-center">
                    Comandă flori cadou online cu livrare în aceeași zi – rapid și simplu!
                </p>
            </div>
            <ContinerItems items={orderedProducts} itemsBread={itemsBread} />
        </div>
    );
};


const FilteredProducts = () => {

    return (
        <div className={`relative w-full var(--background)`}>
            <PopUp />
            <Content />
            <Footer />
        </div>
    )
}

export default FilteredProducts;