
// type pentru un produs simplu cum ar fi o planta, ghiveci etc
export interface ProductProps {
    id: string,
    title: string,
    stockCode: string,
    inStock: boolean,
    category: string,
    quantity: number,
    price: number,
}

// type pentru un produs compus cum ar fi un aranjament floral
export interface ComposedProductProps {
    id: string,
    title: string,
    info_category: {
        standard: {
            price: number;
            imageSrc: string,
            composition: ProductProps[],
        },
        premium: {
            price: number;
            imageSrc: string,
            composition: ProductProps[],
        },
        basic: {
            price: number;
            imageSrc: string,
            composition: ProductProps[],
        }
    }
    isPopular: boolean,
    stockCode: string,
    inStock: boolean,
    description: string,
    colors: string,
    category: string,
    promotion: boolean,
    newest: boolean
}

export interface OrderProductProps {
    id: string,
    title: string,
    title_category: string,
    info_category: number,
    quantity: number,
}

// type pentru o comanda
export interface OrderProps {
    id: string,
    orderNumber: string,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    clientAddress: string,
    orderDate: string,
    deliveryDate?: string,
    status: string,
    totalPrice: number,
    products: OrderProductProps[],
}

// type pentru un client
export interface ClientProps {
    id: string,
    name: string,
    surname: string,
    email: string,
    phone: string,
    address: string,
    orders: number,
    createdAt: string,
}