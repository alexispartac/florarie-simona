'use client';
import { usePathname } from "next/navigation";
import PopUp from "../../components/PopUp";
import { Footer } from "@/app/components/Footer";
import React from "react";
import { Anchor, Loader } from '@mantine/core';
import { ContinerItems } from "@/app/components/Products";
import { useProductsGroupedByCategory } from "@/app/components/hooks/fetchProductsGroupedByCategory";

const Content = () => {
    const { data: groupedProducts = {}, isLoading, isError } = useProductsGroupedByCategory();
    
    const pathname = usePathname();
    const lastSegment = pathname.split("/").pop();
    const cleanedText = lastSegment?.replace(/[\d%]+/g, " ");

    const itemsBread = [
        { title: 'Buchetul Simonei', href: '/' },
        { title: 'Ocazii si Evenimente', href: '/occasion&events' },
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
            <ContinerItems items={items} itemsBread={itemsBread} />
        </div>
    );
};

const Page = () => {

    return (
        <div className={`relative w-full var(--background)`}>
            <PopUp />
            <Content />
            <Footer />
        </div>
    )
}


export default Page;