// Merchize API Integration
const MERCHIZE_API_KEY = import.meta.env.VITE_MERCHIZE_API_KEY;
const MERCHIZE_BASE_URL = 'https://api.merchize.com/v1';

export interface MerchizeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  variants: MerchizeVariant[];
  category: string;
}

export interface MerchizeVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  attributes: {
    size?: string;
    color?: string;
    material?: string;
  };
}

export interface MerchizeOrder {
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    address: {
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  items: {
    product_id: string;
    variant_id: string;
    quantity: number;
  }[];
}

class MerchizeAPI {
  private headers = {
    'Authorization': `Bearer ${MERCHIZE_API_KEY}`,
    'Content-Type': 'application/json'
  };

  async getProducts(): Promise<MerchizeProduct[]> {
    try {
      const response = await fetch(`${MERCHIZE_BASE_URL}/products`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Merchize API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Error fetching Merchize products:', error);
      throw error;
    }
  }

  async getProduct(productId: string): Promise<MerchizeProduct> {
    try {
      const response = await fetch(`${MERCHIZE_BASE_URL}/products/${productId}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Merchize API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error('Error fetching Merchize product:', error);
      throw error;
    }
  }

  async createOrder(order: MerchizeOrder): Promise<any> {
    try {
      const response = await fetch(`${MERCHIZE_BASE_URL}/orders`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(order)
      });
      
      if (!response.ok) {
        throw new Error(`Merchize API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error('Error creating Merchize order:', error);
      throw error;
    }
  }

  async getOrders(): Promise<any[]> {
    try {
      const response = await fetch(`${MERCHIZE_BASE_URL}/orders`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Merchize API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.orders;
    } catch (error) {
      console.error('Error fetching Merchize orders:', error);
      throw error;
    }
  }

  async getCategories(): Promise<any[]> {
    try {
      const response = await fetch(`${MERCHIZE_BASE_URL}/categories`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Merchize API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.categories;
    } catch (error) {
      console.error('Error fetching Merchize categories:', error);
      throw error;
    }
  }
}

export const merchizeAPI = new MerchizeAPI();
