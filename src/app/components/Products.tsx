'use client';
import { Breadcrumbs } from '@mantine/core';
import { ItemProps, CartItem } from './../types';
import Link from 'next/link';
import { Button } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../cart/components/CartRedux';
import { RootState } from '../cart/components/CartRedux';

export const Bread = ({ itemsBread }: { itemsBread: React.JSX.Element[] }) => {
  return (
    <div className="flex justify-start my-[20px]">
      <Breadcrumbs
        className="flex flex-row gap-2 text-gray"
        color="gray"
        separator="→"
        separatorMargin="md"
        mt="xs"
      >
        {itemsBread}
      </Breadcrumbs>
    </div>
  );
};

export const Item = ({ item }: { item: ItemProps }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const itemForCart: CartItem = {
    id: item.id,
    title: item.title,
    price: item.info_category.standard.price,
    category: "standard",
    quantity: 1,
    composition: item.info_category.standard.composition
      ? item.info_category.standard.composition.map((comp) => ({
        id: comp.id,
        quantity: 1,
      }))
      : [], 
    image: item.info_category.standard.imageSrc || '',
  };

  const handleAddToCart = () => {
    dispatch(addItem(itemForCart)); 
  };

  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);

  const isOutOfStock = !item.inStock;

  return (
    <div className="relative flex flex-col shadow-md p-4">
      <Link href={`/product/${item.id}`}>
        {item.info_category.standard.imageSrc && (
          <img
            src={item.info_category.standard.imageSrc}
            alt="flower"
            className="h-[130px] w-[180px] md:h-[200px]"
          />
        )}
      </Link>
      <div className="absolute top-0 right-0 bg-[#b756a6] text-white text-xs px-2 py-1 rounded-bl-md">
        {item.isPopular && 'Popular'}
      </div>
      <div className="absolute top-0 left-0 bg-[#b756a6] text-white text-xs px-2 py-1 rounded-br-md">
        {item.promotion && 'Promoție'}
      </div>
      <p className="flex text-start h-[50px] text-xs py-[5px] text-[14px] md:text-[16px]">
        {item.title}
      </p>
      <p className="flex text-center text-xs pb-[10px] text-[12px] font-bold md:text-[18px]">
        {item.info_category.standard.price} RON
      </p>
      <Button
        w={'100%'}
        size="compact-md"
        bg={isInCart ? '#b756a63f' : '#b756a6'}
        disabled={isOutOfStock || isInCart}
        onClick={handleAddToCart}
      >
        {isOutOfStock ? 'Indisponibil' : isInCart ? 'În coș' : 'Adaugă'}
      </Button>
    </div>
  );
};

export const ContinerItems = ({
  items,
  itemsBread,
}: {
  items: ItemProps[];
  itemsBread: React.JSX.Element[];
}) => {
  
  return (
    <div className="bg-white mx-10 my-6 md:mx-20">
      {itemsBread && <Bread itemsBread={itemsBread} />}
      <div className="grid xl:grid-cols-6 grid-cols-2 gap-4">
        {items && items.map((item: ItemProps, idx: number) => (
          <Item item={item} key={idx} />
        ))}
      </div>
    </div>
  );
};