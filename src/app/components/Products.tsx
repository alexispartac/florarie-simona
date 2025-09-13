'use client';
import { Breadcrumbs } from '@mantine/core';
import { ItemProps, CartItem } from './../types';
import Link from 'next/link';
import { Button } from '@mantine/core';

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
  const isOutOfStock = !item.inStock;

  return (
    <div className="relative flex flex-col bg-white rounded-sm transition-all duration-300 overflow-hidden group">
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
      </Link>

      {/* Badges */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {item.isPopular && (
          <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
            Popular
          </span>
        )}
        {item.promotion && (
          <span className="bg-gradient-to-r from-red-700 to-red-800 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
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
      <div className="flex flex-col flex-grow py-2">
        {/* Title */}
        <h3 className="text-sm sm:text-base lg:text-lg font-var(--font-product) text-gray-800 line-clamp-2 min-h-[2rem] sm:min-h-[3rem] transition-colors duration-200">
          {item.title}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between mb-3 mt-auto">
          <span className="text-[0.875rem] flex m-auto justify-center font-var(--font-product) transition-colors duration-200">
            {item.promotion ? (
              <span className="flex items-center gap-2">
                <span className="line-through text-gray-500 text-sm">
                  {(item.info_category.standard.price + 30).toFixed(0)} RON
                </span>
                  {item.info_category.standard.price} RON
              </span>
            ) : (
              <span>
                {item.info_category.standard.price} RON
              </span>
            )}
          </span>
        </div>

        
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        {itemsBread && <Bread itemsBread={itemsBread} />}
        
        {/* Products Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-2 md:grid-cols-4">
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