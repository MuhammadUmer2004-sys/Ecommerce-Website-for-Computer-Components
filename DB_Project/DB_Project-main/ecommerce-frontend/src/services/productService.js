import axios from 'axios';
import { parseProductDescription } from '../utils/productParser';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Request interceptor for auth
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const transformProductResponse = (product) => {
  if (!product) return null;
  const parsedDesc = product.product_desc ? parseProductDescription(product.product_desc) : {};
  
  return {
    id: product.product_id,
    name: product.product_name || 'Unnamed Product',
    price: product.product_price ? product.product_price.toString() : '0',
    stock: product.stock_quantity || 0,
    category_id: product.category_id,
    ...parsedDesc,
    images: product.images || []
  };
};

export const productService = {
  // Get all products with optional filters
  getAllProducts: async (params = {}) => {
    try {
      const backendParams = {
        category_id: params?.category,
        min_price: params?.minPrice,
        max_price: params?.maxPrice
      };
      const response = await axios.get(`${API_BASE_URL}/api/products`, { params: backendParams });
      return response.data.map(transformProductResponse).filter(p => p !== null);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product with images
  getProductById: async (productId) => {
    try {
      const [productRes, imagesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/products/${productId}`),
        axios.get(`${API_BASE_URL}/api/products/${productId}/images`)
      ]);
      
      return {
        ...transformProductResponse(productRes.data),
        images: imagesRes.data || []
      };
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },

  searchProducts: async (keyword) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/search`, {
        params: { keyword } 
      });
      return response.data.map(transformProductResponse).filter(p => p !== null);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Admin: Create product
  createProduct: async (productData) => {
    try {
      const formData = new FormData();
      // Basic product info
      formData.append('category_id', productData.category_id);
      formData.append('product_name', productData.product_name);
      formData.append('product_price', productData.product_price);
      formData.append('stock_quantity', productData.stock_quantity);
      formData.append('product_desc', productData.product_desc);

      // Handle images
      if (productData.images) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await axios.post(`${API_BASE_URL}/api/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create product");
    }
  },

  // Admin: Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update product");
    }
  },

  // Admin: Delete product
  deleteProduct: async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${productId}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete product");
    }
  },

  // Admin: Bulk upload
  bulkUploadProducts: async (csvFile) => {
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      
      const response = await axios.post(`${API_BASE_URL}/api/products/bulk-add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to bulk upload products");
    }
  }
};
