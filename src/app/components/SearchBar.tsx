'use client';
import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAllProducts } from '@/app/components/hooks/fetchProductsGroupedByCategory';
import { ComposedProductProps } from '@/app/types/products';
import Link from 'next/link';


const ContinerSearch = ({products, close}: {products: ComposedProductProps[], close: () => void}) => {
    
    return (
        <>
        {products.length === 0 ? (
            <div className="flex h-[90%] w-full items-center justify-center w-full border border-gray-300 rounded-md my-2">
                <IconSearch size={50} />
                <p>Rezultatele cautarii</p>
            </div>
        ) : (
        
        <div className="flex flex-col items-center h-full w-full">
            {products.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id} onClick={() => {close()}} className="flex w-full h-[50px] flex-row items-left gap-2 my-2 justify-start">
                    {product.images && product.images.length > 0 && (
                        <img src={product.images[0].url} alt={product.title} className="w-[40px] h-[40px] object-cover" />
                    )}
                    <p>{product.title}</p>
                </Link>
            ))}
        </div>
        )}
        </>
    );
}

const SearchBar = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const { data: allProducts } = useAllProducts();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<ComposedProductProps[]>([]);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validateInput = (input: string): boolean => {
        if (input.length > 50) {
            setError('Căutarea nu poate depăși 50 de caractere');
            return false;
        }
        // Basic XSS protection
        const dangerousChars = /[<>/\\{}[\];&]/;
        if (dangerousChars.test(input)) {
            setError('Căutarea conține caractere nepermise');
            return false;
        }
        setError(null);
        return true;
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        const isValid = validateInput(value);
        
        setSearchTimeout(setTimeout(() => {
            if (value.length > 0 && isValid && allProducts) {
                const filteredProducts = allProducts.filter((product: ComposedProductProps) => {
                    return product?.title?.toLowerCase().includes(value.toLowerCase());
                });
                setFilteredProducts(filteredProducts || []);
            } else {
                setFilteredProducts([]);
            }
        }, 800)); 
    };


    return (
        <div>
            <button onClick={() => {open()}} className='flex items-center justify-center h-[34px] w-[34px] cursor-pointer '>
                <IconSearch size={20} />
            </button>

            <Modal opened={opened} onClose={close} title="Cautare" fullScreen={true} withCloseButton={true} centered overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
                <div className='flex flex-col h-[calc(100vh-90px)]'>
                    <div className="flex h-[5%] items-center justify-center w-full my-2">
                        <div className="w-full">
                            <input 
                                type="text" 
                                value={searchQuery} 
                                onChange={handleSearchChange} 
                                placeholder="Cautare" 
                                maxLength={50}
                                className={`w-full h-[34px] border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md px-2 py-1 my-2 ring-gray-300 focus:ring-2 focus:ring-gray-300`} 
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-1">{error}</p>
                            )}
                        </div>
                        <button className="flex items-center justify-center h-[34px] w-[34px] cursor-pointer border border-gray-300 rounded-md px-2 py-1 my-2 ring-gray-300 focus:ring-2 focus:ring-gray-300 mx-2">
                            <IconSearch size={20} />
                        </button>
                    </div>
                    <div className="flex h-[90%] w-full items-center justify-center overflow-y-auto mb-5">
                        <ContinerSearch products={filteredProducts} close={close} />
                    </div>
                </div>
            </Modal>    

        </div>
    );
};

export default SearchBar;