// Unified E-commerce Service
import { printfulAPI, type PrintfulProduct, type PrintfulOrder } from './printful';
import { merchizeAPI, type MerchizeProduct, type MerchizeOrder } from './merchize';

export type UnifiedProduct = {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  description?: string;
  source: 'printful' | 'merchize';
  variants: any[];
  category?: string;
};

export type UnifiedOrder = {
  source: 'printful' | 'merchize';
  orderData: PrintfulOrder | MerchizeOrder;
};

class EcommerceService {
  async getAllProducts(): Promise<UnifiedProduct[]> {
    try {
      const [printfulProducts, merchizeProducts] = await Promise.all([
        this.getPrintfulProducts(),
        this.getMerchizeProducts()
      ]);

      return [...printfulProducts, ...merchizeProducts];
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  }

  private async getPrintfulProducts(): Promise<UnifiedProduct[]> {
    try {
      const products = await printfulAPI.getProducts();
      return products.map(product => ({
        id: `printful-${product.id}`,
        name: product.name,
        price: parseFloat(product.retail_price),
        currency: product.currency,
        images: [product.thumbnail_url],
        source: 'printful' as const,
        variants: product.variants,
        description: `Premium ${product.name} from Printful`
      }));
    } catch (error) {
      console.error('Error fetching Printful products:', error);
      return [];
    }
  }

  private async getMerchizeProducts(): Promise<UnifiedProduct[]> {
    try {
      const products = await merchizeAPI.getProducts();
      return products.map(product => ({
        id: `merchize-${product.id}`,
        name: product.name,
        price: product.price,
        currency: product.currency,
        images: product.images,
        source: 'merchize' as const,
        variants: product.variants,
        description: product.description,
        category: product.category
      }));
    } catch (error) {
      console.error('Error fetching Merchize products:', error);
      return [];
    }
  }

  async getProduct(productId: string): Promise<UnifiedProduct | null> {
    const [source, id] = productId.split('-');
    
    try {
      if (source === 'printful') {
        const product = await printfulAPI.getProduct(parseInt(id));
        return {
          id: productId,
          name: product.name,
          price: parseFloat(product.retail_price),
          currency: product.currency,
          images: [product.thumbnail_url],
          source: 'printful',
          variants: product.variants,
          description: `Premium ${product.name} from Printful`
        };
      } else if (source === 'merchize') {
        const product = await merchizeAPI.getProduct(id);
        return {
          id: productId,
          name: product.name,
          price: product.price,
          currency: product.currency,
          images: product.images,
          source: 'merchize',
          variants: product.variants,
          description: product.description,
          category: product.category
        };
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
    
    return null;
  }

  async createOrder(order: UnifiedOrder): Promise<any> {
    try {
      if (order.source === 'printful') {
        return await printfulAPI.createOrder(order.orderData as PrintfulOrder);
      } else if (order.source === 'merchize') {
        return await merchizeAPI.createOrder(order.orderData as MerchizeOrder);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrders(): Promise<any[]> {
    try {
      const [printfulOrders, merchizeOrders] = await Promise.all([
        printfulAPI.getOrders().catch(() => []),
        merchizeAPI.getOrders().catch(() => [])
      ]);

      return [
        ...printfulOrders.map(order => ({ ...order, source: 'printful' })),
        ...merchizeOrders.map(order => ({ ...order, source: 'merchize' }))
      ];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
}

export const ecommerceService = new EcommerceService();
