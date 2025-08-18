'use client';
import { Breadcrumbs } from '@mantine/core';
import { ItemProps, CartItem } from './../types';
import Link from 'next/link';
import { Button } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../cart/components/CartRedux';
import { RootState } from '../cart/components/CartRedux';
import { useRouter } from 'next/navigation';

export const Bread = ({ itemsBread }: { itemsBread: React.JSX.Element[] }) => {
  return (
    <div className="flex justify-start my-4 px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        className="flex flex-row gap-2 text-pink-600"
        color="#f299b7ff"
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
  const router = useRouter();

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
    return router.push('/cart');
  };

  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);
  const isOutOfStock = !item.inStock;

  return (
    <div className="relative flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-pink-100 hover:border-pink-200">
      {/* Image Container */}
      <Link href={`/product/${item.id}`} className="relative overflow-hidden">
        {item.info_category.standard.imageSrc && (
          <img
            src={item.info_category.standard.imageSrc}
            alt={item.title}
            className="w-full h-40 sm:h-48 md:h-52 lg:h-56 xl:h-60 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}
        
        {/* Overlay on hover with pink tint */}
        <div className="absolute inset-0 bg-pink-500 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </Link>

      {/* Badges */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {item.isPopular && (
          <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
            Popular
          </span>
        )}
        {item.promotion && (
          <span className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
            Promoție
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
            Stoc epuizat
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-3 sm:p-4">
        {/* Title */}
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-pink-700 transition-colors duration-200">
          {item.title}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between mb-3 mt-auto">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-600 group-hover:text-pink-700 transition-colors duration-200">
            {item.info_category.standard.price} RON
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          fullWidth
          size="sm"
          className={`
            transition-all duration-200 font-medium rounded-lg
            ${isInCart 
              ? 'bg-pink-100 text-pink-700 border-2 border-pink-300 hover:bg-pink-200 hover:border-pink-400' 
              : isOutOfStock
              ? 'bg-gray-100 text-gray-500 border-2 border-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-2 border-transparent'
            }
          `}
          disabled={isOutOfStock || isInCart}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Indisponibil' : isInCart ? '✓ În coș' : 'Adaugă în coș'}
        </Button>
      </div>
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
    <div className="bg-gradient-to-br from-pink-50 to-pink-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        {itemsBread && <Bread itemsBread={itemsBread} />}
        
        {/* Products Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {items && items.map((item: ItemProps, idx: number) => (
            <Item item={item} key={item.id || idx} />
          ))}
        </div>

        {/* Empty State */}
        {(!items || items.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow-lg border border-pink-100">
            <div className="text-6xl mb-4">🌸</div>
            <h3 className="text-xl font-semibold text-pink-600 mb-2" style={{ fontFamily: 'var(--font-dancing)' }}>
              Nu sunt produse disponibile
            </h3>
            <p className="text-pink-400 max-w-md">
              Ne pare rău, momentan nu avem produse în această categorie. 
              Vă rugăm să verificați din nou mai târziu.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700"
              onClick={() => window.location.href = '/homepage'}
            >
              Înapoi la pagina principală
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};