import { invoke } from '@tauri-apps/api/tauri'
import { ProductType } from '../components/Products'

export default function FetchProducts(setProducts: React.Dispatch<React.SetStateAction<ProductType | null>>, filePath: string) {
  invoke<ProductType>('prodouctoss', { filePath: filePath })
    .then(result => setProducts(result))
    .catch(console.error)
}
