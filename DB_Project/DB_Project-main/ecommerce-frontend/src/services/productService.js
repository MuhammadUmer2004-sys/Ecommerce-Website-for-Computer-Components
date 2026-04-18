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
  
  // Hardcoded High-Quality Fallbacks for IDs
  const hardcodedImages = {
    1: 'https://images.unsplash.com/photo-1517336712462-8360dec82354?auto=format&fit=crop&q=80&w=600', // Macbook
    2: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600', // HP Victus
    3: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600', // ViewSonic
    5: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600', // Monitor
    6: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=600', // GPU
    8: 'https://images.unsplash.com/photo-1597872200349-016042c13059?auto=format&fit=crop&q=80&w=600', // SSD
  };

  let images = product.images || [];
  if (typeof images === 'string') {
    try { images = JSON.parse(images); } catch (e) { images = []; }
  }
  
  const mainImageUrl = (images && images.length > 0) ? images[0].image_url : (hardcodedImages[product.product_id] || "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600");

  return {
    id: product.product_id,
    name: product.product_name || 'Unnamed Product',
    price: product.product_price ? product.product_price.toString() : '0',
    stock: product.stock_quantity || 0,
    category_id: product.category_id,
    ...parsedDesc,
    images: images.length > 0 ? images.map(img => ({ ...img, image_url: img.image_url || mainImageUrl })) : [{ image_url: mainImageUrl }],
    image: mainImageUrl
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
      const response = await axios.get(`${API_BASE_URL}/api/products/${productId}`);
      return transformProductResponse(response.data);
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
