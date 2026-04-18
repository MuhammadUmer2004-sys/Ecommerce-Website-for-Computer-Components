// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// export const categoryService = {
//   getCategoryById: async (categoryId) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/categories/${categoryId}`);
//       const [brands, description] = response.data.category_desc.split('\\');
//       return {
//         id: response.data.category_id,
//         name: response.data.category_name,
//         brands: brands.split('\\'),
//         description
//       };
//     } catch (error) {
//       throw new Error(error.response?.data?.message || "Failed to fetch category");
//     }
//   }
// };