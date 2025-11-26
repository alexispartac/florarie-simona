'use client';
import { useState, useEffect } from 'react';
import { IconFilters, IconFilter, IconSortAZ, IconTrash } from '@tabler/icons-react';
import { Modal, RangeSlider, Button, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFilters } from '@/app/components/context/FiltersContext';
import { CriteriaFilterProps } from '@/app/components/context/FiltersContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ProductStockProps } from '../types/stock-products';

const sortCriteria = [
    "Pret crescator",
    "Pret descrescator",
    "Cele mai populare",
    "Cea mai mare promotie",
]


const FilterContiner = ({ setSelectedFilters, selectedFilters, filteredData }: { setSelectedFilters: (filters: CriteriaFilterProps) => void, selectedFilters: CriteriaFilterProps, filteredData: CriteriaFilterProps }) => {

    const handleCategoryClick = (category: string) => {
        if (selectedFilters.category.includes(category)) {
            setSelectedFilters({ ...selectedFilters, category: selectedFilters.category.filter((item) => item !== category) });
        } else {
            setSelectedFilters({ ...selectedFilters, category: [...selectedFilters.category, category] });
        }
    };

    const handleColorClick = (color: string) => {
        if (selectedFilters.colors.includes(color)) {
            setSelectedFilters({ ...selectedFilters, colors: selectedFilters.colors.filter((item) => item !== color) });
        } else {
            setSelectedFilters({ ...selectedFilters, colors: [...selectedFilters.colors, color] });
        }
    };

    const handleComponentClick = (component: string) => {
        if (selectedFilters.components.includes(component)) {
            setSelectedFilters({ ...selectedFilters, components: selectedFilters.components.filter((item) => item !== component) });
        } else {
            setSelectedFilters({ ...selectedFilters, components: [...selectedFilters.components, component] });
        }
    };

    const handlePriceChange = (value: number[]) => {
        setSelectedFilters({ ...selectedFilters, price_min: value[0], price_max: value[1] });
    };

    const handlePromotionChange = (value: boolean) => {
        setSelectedFilters({ ...selectedFilters, promotion: value });
    };

    const handlePopularChange = (value: boolean) => {
        setSelectedFilters({ ...selectedFilters, popular: value });
    };

    return (
        <div className='flex flex-col w-full md:w-[50%] md:m-auto my-10 gap-4'>
            <div>
                <p className='font-bold py-2'>Categorie</p>
                <div>
                    <div className='flex flex-nowrap gap-2 overflow-x-scroll'>
                        {filteredData.category.map((category, index) => (
                            <p onClick={() => handleCategoryClick(category)} className={`flex items-center justify-center text-center p-2 cursor-pointer border border-gray-300 rounded-md ${selectedFilters.category.includes(category) ? 'bg-gray-200' : ''}`} key={`${category}-${index}`}>{category}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <p className='font-bold py-2'>Culoare</p>
                <div>
                    <div className='flex flex-nowrap gap-2 overflow-x-scroll'>
                        {filteredData.colors.map((color, index) => (
                            <p onClick={() => handleColorClick(color)} className={`flex items-center justify-center text-center p-2 cursor-pointer border border-gray-300 rounded-md ${selectedFilters.colors.includes(color) ? 'bg-gray-200' : ''}`} key={`${color}-${index}`}>{color}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <p className='font-bold py-2'>Continut</p>
                <div>
                    <div className='flex flex-nowrap gap-2 overflow-x-scroll'>
                        {filteredData.components.map((component, index) => (
                            <p onClick={() => handleComponentClick(component)} className={`flex items-center justify-center text-center p-2 cursor-pointer border border-gray-300 rounded-md ${selectedFilters.components.includes(component) ? 'bg-gray-200' : ''}`} key={`${component}-${index}`}>{component}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <p className='font-bold py-2'>Pret</p>
                <div className='ml-5'>
                    <RangeSlider
                        min={0}
                        max={1000}
                        value={[selectedFilters.price_min, selectedFilters.price_max]}
                        onChange={handlePriceChange}
                        label={value => `${value} lei`}
                        marks={[
                            { value: selectedFilters.price_min, label: `${selectedFilters.price_min} lei` },
                            { value: selectedFilters.price_max, label: `${selectedFilters.price_max} lei` },
                        ]}
                    />
                </div>
            </div>
            <div>
                <p className='font-bold py-2'>Promotie</p>
                <div className='ml-5'>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={selectedFilters.promotion} onChange={(e) => handlePromotionChange(e.target.checked)} />
                        <span className="ml-2 text-sm font-medium text-gray-900">Selecteaza</span>
                    </label>
                </div>
            </div>
            <div>
                <p className='font-bold py-2'>Populare</p>
                <div className='ml-5'>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={selectedFilters.popular} onChange={(e) => handlePopularChange(e.target.checked)} />
                        <span className="ml-2 text-sm font-medium text-gray-900">Selecteaza</span>
                    </label>
                </div>
            </div>

        </div>
    );
}

const SortContiner = ({ setSelectedSort, selectedSort }: { setSelectedSort: (sort: string) => void, selectedSort: string | null }) => {
    return (
        <div className='flex flex-col w-full md:w-[50%] md:m-auto my-10'>
            {sortCriteria.map((criteria) => (
                <div
                    key={criteria}
                    className='flex flex-col items-start gap-1 py-2'
                >
                    <div className='flex flex-row w-full justify-between items-center'>
                        <p>{criteria}</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="sort"
                                checked={selectedSort === criteria}
                                onChange={() => setSelectedSort(criteria)}
                                className="sr-only peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-pink-500 peer-checked:bg-pink-500 flex items-center justify-center transition-colors">
                                {selectedSort === criteria && (
                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                )}
                            </div>
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
}


const Filter = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [filterOrSorter, setFilterOrSorter] = useState<'filter' | 'sorter' | null>('filter');
    const [message, setMessage] = useState("");
    const [selectedSort, setSelectedSort] = useState<string>('');
    const [selectedFilters, setSelectedFilters] = useState<CriteriaFilterProps>({
        category: [],
        components: [],
        colors: [],
        price_min: 0,
        price_max: 0,
        promotion: false,
        popular: false,
    });
    const { filters, setFilters } = useFilters();
    const [filteredData, setFilteredData] = useState<CriteriaFilterProps>({
        category: [],
        components: [],
        colors: ['rosu', 'galben', 'albastru', 'mov', 'verde', 'portocaliu', 'alb', 'negru', 'maro',],
        price_min: 100,
        price_max: 1000,
        promotion: false,
        popular: false,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        axios.get('/api/products-composed-categories')
            .then((response) => {
                const categoryNames = response.data.map((item: { name: string }) => item.name);
                setFilteredData(prev => ({ ...prev, category: categoryNames }));
            })
            .catch((error) => {
                console.error('Error fetching categories and colors:', error);
            });
        axios.get('/api/products')
            .then((response) => {
                const componentNames = response.data.map((item: ProductStockProps) => item.title);
                setFilteredData(prev => ({ ...prev, components: componentNames }));
            })
            .catch((error) => {
                console.error('Error fetching categories and colors:', error);
            });
        setLoading(false);
    }, []);

    const clearFilters = () => {
        setMessage("Filtrele au fost sterse!");
        setSelectedFilters({
            category: [],
            components: [],
            colors: [],
            price_min: 0,
            price_max: 0,
            promotion: false,
            popular: false,
        }
        );
        setFilters({
            ...filters,
            filter: {
                category: [],
                components: [],
                colors: [],
                price_min: 0,
                price_max: 0,
                promotion: false,
                popular: false,
            }
        });
        setTimeout(() => {
            setMessage("");
        }, 3000);
    }

    const clearSort = () => {
        setMessage("Sortarea a fost resetata!");
        setSelectedSort('');
        setFilters({
            ...filters,
            sorter: ''
        });
        setTimeout(() => {
            setMessage("");
        }, 3000);
    }

    const applyFilters = () => {
        setFilters({
            sorter: selectedSort,
            filter: selectedFilters
        });
    }

    const handleApplyFilters = () => {
        applyFilters();
        close();
        router.push('/filtered-products');
    }

    return (
        <div>
            <Button variant="transparent" onClick={open} p={0}>
                <IconFilters size={20} />
            </Button>

            <Modal opened={opened} onClose={close} title="Filtrare" withCloseButton={true} fullScreen={true} centered overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
                {loading ? (
                    <div className='flex flex-col h-[calc(100vh-124px)] items-center justify-center'>
                        <Loader size="xl" />
                    </div>
                ) : (
                    <>
                        <div className='flex flex-col h-[calc(100vh-124px)]'>
                            {message && (
                                <div className='w-full bg-yellow-100 text-yellow-600 p-2 rounded-md my-4 border border-yellow-600'>
                                    {message}
                                </div>
                            )}
                            <div className='flex flex-row h-[5%] mt-3'>
                                <div className='flex flex-row w-full justify-between items-center'>
                                    <div
                                        onClick={() => (setFilterOrSorter('filter'))}
                                        className={`flex w-[50%] flex-row items-center justify-center gap-4 border border-gray-200 cursor-pointer ${filterOrSorter === 'filter' ? 'bg-gray-100' : ''}`}
                                    >
                                        <div
                                            className='flex flex-col items-center gap-1 py-1'
                                        >
                                            <div className='flex flex-row items-center gap-2'>
                                                <IconFilter size={20} />
                                                <p>Filtrare</p>
                                            </div>
                                            <p className='text-xs'> Peste 200+</p>
                                        </div>
                                        <div
                                            className='flex flex-row items-center justify-center gap-2 w-[30px]'
                                            onClick={clearFilters}
                                        >
                                            <IconTrash size={20} />
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => (setFilterOrSorter('sorter'))}
                                        className={`flex w-[50%] flex-row items-center justify-center gap-4 border border-gray-200 cursor-pointer ${filterOrSorter === 'sorter' ? 'bg-gray-100' : ''}`}
                                    >
                                        <div
                                            className='flex flex-col items-center gap-1 py-1'
                                        >
                                            <div className='flex flex-row items-center gap-2'>
                                                <IconSortAZ size={20} />
                                                <p>Sortare</p>
                                            </div>
                                            <p className='text-xs'> Cele mai populare</p>
                                        </div>
                                        <div
                                            className='flex flex-row items-center justify-center gap-2 w-[30px]'
                                            onClick={clearSort}
                                        >
                                            <IconTrash size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {filterOrSorter === 'filter' && <FilterContiner setSelectedFilters={setSelectedFilters} selectedFilters={selectedFilters} filteredData={filteredData} />}
                            {filterOrSorter === 'sorter' && <SortContiner setSelectedSort={setSelectedSort} selectedSort={selectedSort} />}
                        </div>
                        <button onClick={() => handleApplyFilters()} className='flex w-full color-theme items-center justify-center h-[34px] cursor-pointer'>
                            Aplica filtre
                        </button>
                    </>
                )}
            </Modal>

        </div>
    );
};

export default Filter;