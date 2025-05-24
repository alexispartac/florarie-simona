
export interface User {
    id: string,
    name: string,
    surname: string,
    email: string,
    phone: string,
    address: string,
    orders: number,
    createdAt: string,
    password: string,
}

export interface SimpleProductProps {
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
    imageSrc: string,
    price_category: {
        standard: {
            price: number;
        },
        premium: {
            price: number;
        },
        basic: {
            price: number;
        }
    }
    isPopular: boolean,
    stockCode: string,
    inStock: boolean,
    description: string,
    composition: SimpleProductProps[],
    colors: string,
    category: string,
    promotion: boolean,
}

export interface OrderProductProps {
    id: string,
    title: string,
    title_category: string,
    price_category: number
    quantity: number,
}

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