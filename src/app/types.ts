import { Dispatch, SetStateAction } from "react";

export interface checkout_modal_props {
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>
}

export interface PageButtonsProps {
  total_products: number | null;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export interface Product {
  product_id: number,
  name: string,
  description: string,
  price: number,
  quantity: number,
  image?: string,
}

export interface cart_product {
  product_id: number,
  name: string,
  price: number,
  description: string,
  quantity: number,
  selected_quantity: number,
  image?: string,
}

export interface ProductPageProps {
  product: Product;
  cart: cart_product[];
  setCart: Dispatch<SetStateAction<cart_product[]>>;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>
  isCartOpen: boolean
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>
  setSelected: React.Dispatch<React.SetStateAction<Product | cart_product | null>>
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

export interface CategoryState {
  name: boolean,
  description: boolean,
  price: boolean,
  quantity: boolean,
}

export interface formData {
  product_id: number,
  name: string,
  description: string,
  price: number,
  quantity: number,
}

export interface AddNewProductCardProps {
  setAddNewProduct: React.Dispatch<React.SetStateAction<boolean>>
  products_length: number,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}
