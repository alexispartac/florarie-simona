"use client";
import React from "react";
import PopUp from "../components/PopUp";
import { Footer } from "../components/Footer";
import { NavbarDemo } from "../components/NavBar";
import { Anchor } from '@mantine/core';
import { ItemProps } from "../types";
import { ContinerItems } from "../components/Products";

const itemsBread = [
    { title: 'Buchetul Simonei', href: '/' },
    { title: 'Ocazii si evenimente', href: 'occasion&events' },
].map((item, index) => (
    <Anchor className="text-gray-500 hover:text-[#b756a64f]" href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const items: ItemProps[ ] = [
  { id: '1', title: 'Nume Simonei', price: 100 },
  { id: '2', title: 'Nume', price: 200 },
  { id: '3', title: 'Nume', price: 300 },
  { id: '4', title: 'Nume', price: 400 },
  { id: '5', title: 'Nume', price: 500 },
  { id: '6', title: 'Nume', price: 600 },
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
        </div>
    );
};


const OccasionAndEvents = () => {
  
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

export default OccasionAndEvents;