'use client';
import { usePathname } from "next/navigation";
import PopUp from "../../components/PopUp";
import { Footer } from "@/app/components/Footer";
import { NavbarDemo } from "@/app/components/NavBar";
import React from "react";
import { Anchor } from '@mantine/core';
import { ContinerItems } from "@/app/components/Products";
import { ItemProps } from '../../types';
import axios from "axios";


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

const Page = () => {

    return (
        <div className={`relative w-full var(--background)`}>
            <PopUp />
            <NavbarDemo>
                <Content />
            </NavbarDemo>
        </div>
    )
}


export default Page;