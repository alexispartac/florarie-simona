export interface CartItem {
    id: string,
    title: string,
    price: number,
    category: string,
    composition: { id: string, quantity: number }[],
    quantity: number,
    image: string,
}