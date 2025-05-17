"use client";
import React from "react";
import { Footer } from "../components/Footer";
import PopUp from "../components/PopUp";
import { NavbarDemo } from "../components/NavBar";
import { ContinerItems } from "../components/Products";
import { ItemProps } from "../types";
import { Anchor } from '@mantine/core';

const items: ItemProps[] = [
    { id: '1', title: 'Buchetul Simonei', category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
    { id: '2', title: 'Buchete', category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
    { id: '3', title: 'Buchete', category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
    { id: '4', title: 'Buchete', category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
    { id: '5', title: 'Buchete', category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
    { id: '6', title: 'Buchete', category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
]

const itemsBread = [
    { title: 'Buchetul Simonei', href: '/' },
    { title: 'Buchete', href: 'bouquets' },
].map((item, index) => (
    <Anchor className="text-gray-500 hover:text-[#b756a64f]" href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const Content = () => {
    return (
        <div className="relative container mx-auto pt-24">
            <div className="flex justify-center py-3">
                <p className="font-extrabold text-gray-500 text-center">
                    Comandă flori cadou online cu livrare în aceeași zi – rapid și simplu!
                </p>
            </div>
            <ContinerItems items={items} itemsBread={itemsBread} />
        </div>
    );
};

const Bouquets = () => {
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

export default Bouquets; 