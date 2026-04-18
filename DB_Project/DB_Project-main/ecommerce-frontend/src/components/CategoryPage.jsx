import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Slider,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  IconButton,
  CircularProgress,
} from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import ProductCard from "./ProductCard";
import "./../components-css/CategoryPage.css";
import img from "./../images/product-images/product1-image/22-czone.com.pk-1540-15686-010224084552.jpg";

import { productService } from "../services/productService";

const CategoryPage = () => {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);

  const brands = ["Apple", "HP", "Dell", "Lenovo", "ASUS", "Samsung", "ViewSonic", "Seagate"];

  const categoryTitles = {
    laptops: "Laptops",
    storage: "Storage Devices",
    monitors: "Monitors",
    processors: "Processors",
    cases: "PC Cases",
    ram: "Memory",
    gpus: "Graphics Cards",
    motherboards: "Motherboards",
    desktops: "Desktop PCs",
    keyboards: "Keyboards",
  };

  const categoryMapping = {
    laptops: 1,
    monitors: 2,
    processors: 3,
    gpus: 4,
    ram: 5,
    storage: 6,
    motherboards: 7,
    cases: 8,
    keyboards: 9,
    desktops: 10
  };

  useEffect(() => {
    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const catId = categoryMapping[category];
            const data = await productService.getAllProducts({ category: catId });
            setAllProducts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    fetchItems();
  }, [category]);

  useEffect(() => {
    let result = [...allProducts];

    result = result.filter((product) => {
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some(brand => product.name.toLowerCase().includes(brand.toLowerCase()));

      const productPrice = parseFloat(product.price.toString().replace(/,/g, ''));
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];

      return matchesBrand && matchesPrice;
    });

    result.sort((a, b) => {
      const priceA = parseFloat(a.price.toString().replace(/,/g, ''));
      const priceB = parseFloat(b.price.toString().replace(/,/g, ''));
      
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "newest") return b.id - a.id;
      return 0;
    });

    setFilteredProducts(result);
  }, [allProducts, selectedBrands, priceRange, sortBy]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 1000000]);
    setSortBy("featured");
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> /
        <span className="current">{categoryTitles[category]}</span>
      </div>

      <div className="category-banner">
        <div className="banner-content">
          <h1>{categoryTitles[category]}</h1>
          <p>
            Discover our premium selection of{" "}
            {categoryTitles[category].toLowerCase()}
          </p>
        </div>
      </div>

      <div className="category-content">
        <aside className="filters-sidebar">
          <div className="filter-header">
            <h3>Filters</h3>
            <button className="reset-filters" onClick={handleResetFilters}>
              Reset All
            </button>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000000}
              step={10000}
              valueLabelFormat={(value) => `Rs. ${value.toLocaleString()}`}
            />
            <div className="price-range-display">
              <span>Rs. {priceRange[0].toLocaleString()}</span>
              <span>Rs. {priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          <div className="filter-section">
            <h3>Brands</h3>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                }
                label={brand}
              />
            ))}
          </div>

          <div className="filter-section">
            <h3>Availability</h3>
            <RadioGroup
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <FormControlLabel
                value="inStock"
                control={<Radio />}
                label="In Stock"
              />
              <FormControlLabel
                value="outOfStock"
                control={<Radio />}
                label="Out of Stock"
              />
            </RadioGroup>
          </div>
        </aside>

        <main className="products-section">
          <div className="products-header">
            <div className="results-count">
              {filteredProducts.length} products found
            </div>

            <div className="view-controls">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="view-mode-toggle">
                <IconButton
                  onClick={() => setViewMode("grid")}
                  color={viewMode === "grid" ? "primary" : "default"}
                >
                  <GridViewIcon />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode("list")}
                  color={viewMode === "list" ? "primary" : "default"}
                >
                  <ViewListIcon />
                </IconButton>
              </div>
            </div>
          </div>

          <div className={`products-grid ${viewMode}`}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  viewMode={viewMode}
                />
              ))
            ) : (
              <div className="no-results">
                <p>No products found matching your criteria</p>
                <button className="reset-filters" onClick={handleResetFilters}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
