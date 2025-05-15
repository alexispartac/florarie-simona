import { Breadcrumbs } from '@mantine/core';
import { ItemProps } from './../types';

const Bread = ( { itemsBread } : { itemsBread:React.JSX.Element[] } ) => {
    return (
      <div className="flex justify-start my-[20px]">
        <Breadcrumbs className="flex flex-row gap-2" separator="→" separatorMargin="md" mt="xs">
          {itemsBread}
        </Breadcrumbs>
      </div>
    );
}

const Item = (
    { item: { title } }: { item: ItemProps }
) => {
    return (
        <div className="relative flex flex-col shadow-md p-4">
            <img src="/flower.jpeg" alt="flower" className="h-[130px] md:h-[200px]" />
            {/* favorite */}
            <div className="absolute right-6 top-6 flex justify-end">
                <svg xmlns="XXXXXXXXXXXXXXXXXXXXXXXXXX" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </div>
            <p className="flex text-start text-xs py-[5px] md:text-[16px]"> { title }  </p>
            <p className="flex text-center text-xs pb-[10px] font-bold md:text-[18px]"> pret lei </p>
            <button className="text-xs bg-[#b756a64f] cursor-pointer text-white px-4 py-2 rounded-full hover:text-pink-200 hover:bg-white">Adaugă în coș</button>
        </div>
    );
}

export const ContinerItems = ( { items, itemsBread } : { items: ItemProps[], itemsBread: React.JSX.Element[]} ) => {
    return (
        <div className='bg-white mx-10 my-6 md:mx-20'>
            <Bread itemsBread={itemsBread}/>
            <div className="grid xl:grid-cols-6 grid-cols-2 gap-4">
                { items.map(
                    (item: ItemProps, idx: number) => (
                        <Item item={item} key={idx} />
                    )
                )}
            </div>
        </div>
    );

}