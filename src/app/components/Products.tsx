'use client';
import { Breadcrumbs } from '@mantine/core';
import { ItemProps } from './../types';
import Link from 'next/link'
import { Button } from '@mantine/core';

export const Bread = ({ itemsBread }: { itemsBread: React.JSX.Element[] }) => {
    return (
        <div className="flex justify-start my-[20px]">
            <Breadcrumbs className="flex flex-row gap-2 text-gray" color='gray' separator="→" separatorMargin="md" mt="xs">
                {itemsBread}
            </Breadcrumbs>
        </div>
    );
}

export const Item = (
    { item }: { item: ItemProps }
) => {
    return (
        <div className="relative flex flex-col shadow-md p-4">
            <Link href={`/product/${item.id}`}>
                { item.imageSrc &&
                    <img src={item.imageSrc} alt="flower" className="h-[130px] md:h-[200px]" />
                }
                <div className="absolute top-0 right-0 bg-[#b756a6] text-white text-xs px-2 py-1 rounded-bl-md">
                    {item.isPopular && 'Popular'}
                </div>
                <div className="absolute top-0 left-0 bg-[#b756a6] text-white text-xs px-2 py-1 rounded-br-md">
                    {item.promotion && 'Promoție'}
                </div>
                <p className="flex text-start text-xs py-[5px] text-[14px] md:text-[16px]"> {item.title}  </p>
                <p className="flex text-center text-xs pb-[10px] text-[12px] font-bold md:text-[18px]"> {item.price_category.basic.price} RON</p>
                <Button 
                    w={'100%'}
                    size='compact-md'
                    bg={'#b756a64f'}
                >Adaugă</Button>
            </Link>
        </div>
    );
}

export const ContinerItems = ({ items, itemsBread }: { items: ItemProps[], itemsBread: React.JSX.Element[] }) => {
    return (
        <div className='bg-white mx-10 my-6 md:mx-20'>
            <Bread itemsBread={itemsBread} />
            <div className="grid xl:grid-cols-6 grid-cols-2 gap-4">
                {items.map(
                    (item: ItemProps, idx: number) => (
                        <Item item={item} key={idx} />
                    )
                )}
            </div>
        </div>
    );

}