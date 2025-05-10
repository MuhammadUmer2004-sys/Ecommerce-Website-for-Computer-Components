import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';
import ProductCard from './ProductCard';
import { productService } from '../services/productService';
import './../components-css/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await productService.searchProducts(query);
        setProducts(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>Search Results</h1>
        <p className="search-info">
          {products.length} {products.length === 1 ? 'result' : 'results'} for "{query}"
        </p>
      </div>

      {products.length === 0 ? (
        <div className="no-results">
          <img 
            src="/images/no-results.svg" 
            alt="No results found"
            className="no-results-image" 
          />
          <h2>No products found</h2>
          <p>Try checking your spelling or using different keywords</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;