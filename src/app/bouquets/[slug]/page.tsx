'use client';
import React from "react"; 
import { usePathname } from "next/navigation";
import PopUp from "../../components/PopUp";
import { NavbarDemo } from "@/app/components/NavBar";
import { Footer } from "@/app/components/Footer";
import { Anchor } from '@mantine/core';
import { ContinerItems } from "../../components/Products";
import { ItemProps } from "../../types";

const items: ItemProps[] = [
    { id: '1', title: 'Buchetul Simonei', price: 100 },
    { id: '2', title: 'Buchete', price: 200 },
    { id: '3', title: 'Buchete', price: 300 },
    { id: '4', title: 'Buchete', price: 400 },
    { id: '5', title: 'Buchete', price: 500 },
    { id: '6', title: 'Buchete', price: 600 },
]

const Content = () => {
    const pathname = usePathname();
    const lastSegment = pathname.split("/").pop();
    const cleanedText = lastSegment?.replace(/[\d%]+/g, " ");

    const itemsBread = [
        { title: 'Buchetul Simonei', href: '/' },
        { title: 'Buchete', href: '/bouquets' },
        { title: `${cleanedText}`, href: `${cleanedText}` },
    ].map((item, index) => (
        <Anchor className="text-gray-500 hover:text-[#b756a64f]" href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    return (
        <div className="relative container mx-auto pt-24">
            <div className="flex justify-center py-3">
                <p className="font-extrabold text-gray-500 text-center">
                    Comandă flori cadou online cu livrare în aceeași zi – rapid și simplu!  
                </p>
            </div>
            <ContinerItems items={items} itemsBread={itemsBread}/>
        </div>
    );
};

const Page = () => {
   
    return (
        <div className={`relative w-full var(--background)`}>
            <PopUp />
            <NavbarDemo>
                <Content />
            </NavbarDemo>
            <Footer />
        </div>
    )
}


export default Page;