import { ProductStockProps } from "./stock-products";

export interface ProductImageProps {
    url: string,
    public_id: string,
    width: number,
    height: number,
    format: string,
    created_at: string,
} 

export interface ComposedProductProps {
    id: string,
    title: string,
    info_category: {
        standard: {
            price: number;
            imageSrc: string,
            composition: ProductStockProps[],
        }
    }
    images?: ProductImageProps[],
    isPopular: boolean,
    stockCode: string,
    inStock: boolean,
    description: string,
    colors: string,
    category: string,
    promotion: boolean,
    newest: boolean,
    discountPercentage?: number,
}