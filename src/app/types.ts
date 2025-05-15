
export interface ItemProps {
    id: string;
    title: string;
    price: number;
    descrition?: string;
}

export type InfoFormProp = {
    first_name: string,
    last_name: string,
    company?: string,
    email: string,
    phone_number: string,
    message: string
}