
export interface ItemProps {
    id: string,
    title: string,
    imageSrc?: string,
    category: {
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
    isPopular?: boolean,
    stockCode?: string,
    inStock?: boolean,
    description?: string,
    composition?: string,
    flowers?: string,
    colors?: string,
    type?: string, // categoria de flori de exemplu buchete

}

export interface ItemCartProp {
    id: string,
    title: string,
    category: string,
    price: number,
    quantity: number,
}

export type InfoFormProp = {
    first_name: string,
    last_name: string,
    company?: string,
    email: string,
    phone_number: string,
    message: string
}