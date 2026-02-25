// Printful API Integration
const PRINTFUL_API_KEY = import.meta.env.VITE_PRINTFUL_API_KEY;
const PRINTFUL_STORE_ID = import.meta.env.VITE_PRINTFUL_STORE_ID;

const PRINTFUL_BASE_URL = 'https://api.printful.com';

export interface PrintfulProduct {
  id: number;
  name: string;
  thumbnail_url: string;
  retail_price: string;
  currency: string;
  variants: PrintfulVariant[];
}

export interface PrintfulVariant {
  id: number;
  name: string;
  retail_price: string;
  currency: string;
  size?: string;
  color?: string;
}

export interface PrintfulOrder {
  external_id: string;
  shipping: {
    name: string;
    address1: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
  };
  items: {
    external_id: string;
    variant_id: number;
    quantity: number;
  }[];
}

class PrintfulAPI {
  private headers = {
    'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
    'Content-Type': 'application/json'
  };

  async getProducts(): Promise<PrintfulProduct[]> {
    try {
      const response = await fetch(`${PRINTFUL_BASE_URL}/store/${PRINTFUL_STORE_ID}/products`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Printful API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching Printful products:', error);
      throw error;
    }
  }

  async getProduct(productId: number): Promise<PrintfulProduct> {
    try {
      const response = await fetch(`${PRINTFUL_BASE_URL}/store/${PRINTFUL_STORE_ID}/products/${productId}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Printful API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching Printful product:', error);
      throw error;
    }
  }

  async createOrder(order: PrintfulOrder): Promise<any> {
    try {
      const response = await fetch(`${PRINTFUL_BASE_URL}/store/${PRINTFUL_STORE_ID}/orders`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(order)
      });
      
      if (!response.ok) {
        throw new Error(`Printful API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating Printful order:', error);
      throw error;
    }
  }

  async getOrders(): Promise<any[]> {
    try {
      const response = await fetch(`${PRINTFUL_BASE_URL}/store/${PRINTFUL_STORE_ID}/orders`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Printful API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching Printful orders:', error);
      throw error;
    }
  }
}

export const printfulAPI = new PrintfulAPI();
