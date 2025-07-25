'use client';
import { useProductsGroupedByCategory } from "@/app/components/hooks/fetchProductsGroupedByCategory";
import { ContinerItems } from "../../components/Products";
import { Footer } from "@/app/components/Footer";
import { Anchor, Loader } from '@mantine/core';
import { usePathname } from "next/navigation";
import PopUp from "../../components/PopUp";
import React from "react";

const Content = () => {
    const { data: groupedProducts = {}, isLoading, isError } = useProductsGroupedByCategory();

    const pathname = usePathname();
    const lastSegment = pathname.split("/").pop();
    const cleanedText = lastSegment?.replace(/[\d%]+/g, " ");
    
    const itemsBread = [
        { title: 'Buchetul Simonei', href: '/' },
        { title: 'Aranjamente', href: '/arrangements' },
        { title: `${cleanedText}`, href: `${cleanedText}` },
    ].map((item, index) => (
        <Anchor c={"#b756a6"} href={item.href} key={index}>
                {item.title}
        </Anchor>
    ));

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

    const items = groupedProducts[`${cleanedText}`] || [];

    return (
        <div className="relative container mx-auto pt-24">
            <div className="flex justify-center py-3">
                <p className="font-extrabold text-gray-500 px-3 text-center">
                    Comandă flori cadou online cu livrare în aceeași zi – rapid și simplu!
                </p>
            </div>
            <ContinerItems items={items} itemsBread={itemsBread}/>
        </div>
    );
};

const Page = () => {
    return (
        <div>
            <PopUp />
            <Content />
            <Footer />
        </div>
    );
};

export default Page;