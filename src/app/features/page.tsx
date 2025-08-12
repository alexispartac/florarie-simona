'use client';
import { useNewestProducts } from '@/app/components/hooks/fetchProductsGroupedByCategory'
import { ContinerItems } from '@/app/components/Products'
import { Anchor, Loader } from '@mantine/core'
import { Footer } from '../components/Footer'
import PopUp from '../components/PopUp'
import { ItemProps } from '@/app/types'
import React from 'react'

const Content = () => {
    const { data: promotionProducts, isLoading, isError } = useNewestProducts();

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

    const items: ItemProps[] = promotionProducts;

    const itemsBread = [
        { title: 'Buchetul Simonei', href: '/homepage' },
        { title: 'Noutati', href: '/features' },
    ].map((item, index) => (
        <Anchor c={"#b756a6"} href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

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

const Feature = () => {
    return (
        <div>
            <PopUp />
            <Content />
            <Footer />
        </div>
    )
}

export default Feature