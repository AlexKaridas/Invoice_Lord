export default interface Product {
  product_id: number,
  name: string,
  description: string,
  price: number,
  quantity: number,
  image?: string,
}
export default interface cart_product {
  product_id: number,
  name: string,
  price: number,
  quantity: number,
  selected_quantity: number,
}

