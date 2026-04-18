import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const cartService = {
    addToCart: async (productId, quantity = 1) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/cart/add`,
                { product_id: productId, quantity },
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error("Cart add error", error);
        }
    },

    getCart: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/cart`,
                getAuthHeaders()
            );
            return response.data.data;
        } catch (error) {
            console.error("Cart fetch error", error);
            return [];
        }
    },

    removeFromCart: async (productId) => {
        try {
            await axios.delete(
                `${API_BASE_URL}/api/cart/remove`,
                { 
                    ...getAuthHeaders(),
                    data: { product_id: productId }
                }
            );
        } catch (error) {
            console.error("Cart remove error", error);
        }
    }
};
