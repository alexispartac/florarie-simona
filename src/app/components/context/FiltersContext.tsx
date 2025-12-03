'use client';
import { createContext, useState, useContext } from 'react';
import { ReactNode } from 'react';

export interface CriteriaFilterProps {
    category: string[],
    components: string[],
    colors: string[],
    price_min: number,
    price_max: number,
    promotion: boolean,
    popular: boolean,
}

export interface FiltersContext {
    sorter: string,
    filter: CriteriaFilterProps
}

export interface FiltersContextType {
    filters: FiltersContext,
    setFilters: React.Dispatch<React.SetStateAction<FiltersContext>>;
}

const FiltersContext = createContext<FiltersContextType>({
    filters: {
        sorter: '',
        filter: {
            category: [],
            components: [],
            colors: [],
            price_min: 0,
            price_max: 0,
            promotion: false,
            popular: false,
        }
    },
    setFilters: () => {},
})

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
    const [filters, setFilters] = useState<FiltersContext>({
        sorter: '',
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

    return (
        <FiltersContext value={{ filters, setFilters }}>
            {children}
        </FiltersContext>
    );
};

export const useFilters = () => {
    return useContext(FiltersContext);
};
