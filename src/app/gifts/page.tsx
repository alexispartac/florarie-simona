"use client";
import React from "react";
import { Anchor } from '@mantine/core';
import { Footer } from "../components/Footer";
import { NavbarDemo } from "../components/NavBar";
import PopUp from "../components/PopUp";
import { ContinerItems } from "../components/Products";
import { ItemProps } from "../types";

const itemsBread = [
    { title: 'Buchetul Simonei', href: '/' },
    { title: 'Cadouri', href: 'gifts' },
].map((item, index) => (
    <Anchor className="text-gray-500 hover:text-[#b756a64f]" href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const items: ItemProps[ ] = [
  { id: '1', title: 'NumeC Simonei', price: 100 },
  { id: '2', title: 'NumeC', price: 200 },
  { id: '3', title: 'NumeC', price: 300 },
  { id: '4', title: 'NumeC', price: 400 },
  { id: '5', title: 'NumeC', price: 500 },
  { id: '6', title: 'NumeC', price: 600 },
]

const Content = () => {
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