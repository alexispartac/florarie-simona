'use client';
import React from "react";
import { usePathname } from "next/navigation";
import PopUp from "../../components/PopUp";
import { NavbarDemo } from "@/app/components/NavBar";
import { Footer } from "@/app/components/Footer";
import { Anchor } from '@mantine/core';
import { ItemProps } from "@/app/types";
import { ContinerItems } from "../../components/Products";

const items: ItemProps[] = [
    { id: '1', title: 'Aranjamentul Simonei', price: 100 },
    { id: '2', title: 'Aranjament', price: 200 },
    { id: '3', title: 'Aranjament', price: 300 },
    { id: '4', title: 'Aranjament', price: 400 },
    { id: '5', title: 'Aranjament', price: 500 },
    { id: '6', title: 'Aranjament', price: 600 },
]

const Content = () => {
    const pathname = usePathname();
    const lastSegment = pathname.split("/").pop();
    const cleanedText = lastSegment?.replace(/[\d%]+/g, " ");

    const itemsBread = [
        { title: 'Buchetul Simonei', href: '/' },
        { title: 'Aranjamente', href: '/arrangements' },
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
            <Footer />
        </div>
    );
};

const Page = () => {

    return (
        <div>
            <PopUp />
            <NavbarDemo>
                <Content />
            </NavbarDemo>
        </div>
    )
}


export default Page;