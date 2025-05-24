"use client";
import React from "react";
import { Footer } from "../components/Footer";
import PopUp from "../components/PopUp";
import { NavbarDemo } from "../components/NavBar";
import { Anchor } from '@mantine/core';
import { ContinerItems } from "../components/Products";
import { ItemProps } from "../types";
import axios from "axios";

const itemsBread = [
    { title: 'Buchetul Simonei', href: '/' },
    { title: 'Aranjamente', href: 'arrangements' },
].map((item, index) => (
    <Anchor c={"#b756a6"} href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const URL_COMPOSED_PRODUCTS = 'http://localhost:3000/api/products-composed';
const Content = () => {
    const [items, setItems] = React.useState<ItemProps[]>([]);

    function fetchItems() {
        axios.get(URL_COMPOSED_PRODUCTS).then(response => {
            const data = response.data as ItemProps[];
            setItems(data);
        }
        ).catch(error => {
            console.error("Error fetching items:", error);
        });
    }

    React.useEffect(() => {
        fetchItems();
    }, []);
    
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