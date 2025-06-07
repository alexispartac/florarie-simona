
export interface CartItem {
  id: string;
  title: string;
  price: number;
  category: string;
  quantity: number;
  image: string;
}


export interface CartState {
  items: CartItem[];
}