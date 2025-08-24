// API Configuration for Production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://zaui-coffee-backend.onrender.com/api'  // Production URL
    : 'http://localhost:3001/api');                   // Development URL

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async zaloLogin(accessToken: string): Promise<ApiResponse> {
    return this.request('/auth/zalo-login', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  }

  async updatePhone(phone: string): Promise<ApiResponse> {
    return this.request('/auth/update-phone', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request('/auth/me');
  }

  // Order endpoints
  async getOrders(): Promise<ApiResponse> {
    return this.request('/orders');
  }

  async createOrder(orderData: any): Promise<ApiResponse> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId: string): Promise<ApiResponse> {
    return this.request(`/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse> {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const baseUrl = API_BASE_URL.replace('/api', '');
    const response = await fetch(`${baseUrl}/health`);
    return response.json();
  }

  // Voucher endpoints
  async getVouchers(): Promise<ApiResponse> {
    return this.request('/vouchers');
  }

  async createVoucher(voucherData: any): Promise<ApiResponse> {
    return this.request('/vouchers', {
      method: 'POST',
      body: JSON.stringify(voucherData),
    });
  }

  async updateVoucherStatus(id: string, isActive: boolean): Promise<ApiResponse> {
    return this.request(`/vouchers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async deleteVoucher(id: string): Promise<ApiResponse> {
    return this.request(`/vouchers/${id}`, {
      method: 'DELETE',
    });
  }

  async validateVoucher(code: string, orderAmount: number): Promise<ApiResponse> {
    return this.request('/vouchers/validate', {
      method: 'POST',
      body: JSON.stringify({ code, orderAmount }),
    });
  }

  // Product endpoints
  async getProducts(): Promise<ApiResponse> {
    return this.request('/products');
  }

  async getProductsByCategory(categorySlug: string): Promise<ApiResponse> {
    return this.request(`/products/category/${categorySlug}`);
  }

  async getProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any): Promise<ApiResponse> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any): Promise<ApiResponse> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
