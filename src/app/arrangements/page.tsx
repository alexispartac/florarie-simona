"use client";
import React from "react";
import { Footer } from "../components/Footer";
import PopUp from "../components/PopUp";
import { NavbarDemo } from "../components/NavBar";
import { Anchor } from '@mantine/core';
import { ContinerItems } from "../components/Products";
import { ItemProps } from "../types";

const itemsBread = [
    { title: 'Buchetul Simonei', href: '/' },
    { title: 'Aranjamente', href: 'arrangements' },
].map((item, index) => (
    <Anchor className="text-gray-500 hover:text-[#b756a64f]" href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const items: ItemProps[ ] = [
  { id: '1', title: 'Aranjamentul Simonei', price: 100 },
  { id: '2', title: 'Aranjament', price: 200 },
  { id: '3', title: 'Aranjament', price: 300 },
  { id: '4', title: 'Aranjament', price: 400 },
  { id: '5', title: 'Aranjament', price: 500 },
  { id: '6', title: 'Aranjament', price: 600 },
]

const Content = () => {
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


const Arrangements = () => {
  return (
    <div >
        <PopUp />
        <NavbarDemo>
            <Content />
        </NavbarDemo>
        <Footer />
    </div>
  )
}

export default Arrangements;