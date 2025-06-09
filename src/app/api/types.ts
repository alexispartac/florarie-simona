
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
    info_category: {
        standard: {
            price: number;
            imageSrc: string,
        },
        premium: {
            price: number;
            imageSrc: string,
        },
        basic: {
            price: number;
            imageSrc: string,
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
    newest: boolean,
}

export interface OrderProductProps {
    id: string;
    title: string;
    price: number;
    category: string;
    quantity: number;
    image?: string;
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
    info?: string,
    status: string,
    totalPrice: number,
    products: OrderProductProps[],
}

export interface BlogPostProps {
    id: string;
    title: string;
    date: string;
    description: string;
    image: string | null;
    likes: number;
    dislikes: number;
    likedBy: string[];
    dislikedBy: string[];
}