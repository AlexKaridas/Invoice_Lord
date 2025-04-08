import { Dispatch, SetStateAction } from "react";

export interface Product {
  product_id?: number,
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
  setEditSubmit: React.Dispatch<React.SetStateAction<boolean>>
  edit_submit: boolean
  setSelected: React.Dispatch<React.SetStateAction<Product | cart_product | null>>
  setRemoveProduct: React.Dispatch<React.SetStateAction<boolean>>
  remove_product: boolean
}

export interface CategoryState {
  name: boolean,
  description: boolean,
  price: boolean,
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
  setNewProduct: Dispatch<SetStateAction<Product>>;
  setSubmitNewProduct: React.Dispatch<SetStateAction<boolean>>;
  new_product: Product,
  products_length: number,
}
