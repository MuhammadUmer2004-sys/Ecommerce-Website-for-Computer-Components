import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./../components-css/ProductDetail.css";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useCart } from "./../context/CartContext";
import { useAuth } from "./../context/AuthContext";
import { productService } from "../services/productService";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useWishlist } from "./../context/WishListContext";
import { CircularProgress, Alert } from "@mui/material";

import i11 from "./../images/product-images/product1-image/22-czone.com.pk-1540-15686-010224084552.jpg";
import i12 from "./../images/product-images/product1-image/23-czone.com.pk-1540-15686-010224084552.jpg";
import i13 from "./../images/product-images/product1-image/copy-20-czone.com.pk-1540-15685-010224083833.jpg";
import i14 from "./../images/product-images/product1-image/copy-21-czone.com.pk-1540-15685-010224083833.jpg";

import i21 from "../images/product-images/product2-image/6-czone.com.pk-1540-17301-131124112143.jpg";
import i22 from "../images/product-images/product2-image/7-czone.com.pk-1540-17301-131124112143.jpg";

import i31 from "../images/product-images/product3-image/21-czone.com.pk-1540-15929-070524072032.jpg";
import i32 from "../images/product-images/product3-image/gpg-24-mon-vx2779-hd-pro-prdp-b01-pc-1540-15929-070524072145.jpg";
import i33 from "../images/product-images/product3-image/gpg-24-mon-vx2779-hd-pro-prdp-lf02-pc-1540-15929-070524072145.jpg";

import i41 from "../images/product-images/product4-image/52-czone.com.pk-1540-12064-210223095208.jpg";
import i42 from "../images/product-images/product4-image/copy-71-5oiugmhl.-sl1500--1540-7478-220119104853.jpg";
import i43 from "../images/product-images/product4-image/copy-71-jn-nzlsl.-sl1500--1540-7478-220119104853.jpg";
import i44 from "../images/product-images/product4-image/copy-71lyjamllql.-sl1500--1540-7478-220119104853.jpg";

import i51 from "../images/product-images/product5-image/6-czone.com.pk-1-1540-15343-111023080631.jpg";
import i52 from "../images/product-images/product5-image/7-czone.com.pk-1-1540-15343-111023080631.jpg";
import i53 from "../images/product-images/product5-image/9-czone.com.pk-1-1540-15343-111023080631.jpg";

import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import { Rating, Avatar, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ProductDetail = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  const handlePrevImage = () => {
    if (product?.images) {
      setActiveImage((prev) =>
        prev > 0 ? prev - 1 : product.images.length - 1
      );
    }
  };

  const handleNextImage = () => {
    if (product?.images) {
      setActiveImage((prev) =>
        prev < product.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const featuredProducts = {
    101: {
      id: 101,
      name: "Macbook Pro M3 Chip",
      brand: "Apple",
      price: "744,900",
      description: "Premium Laptop for Professionals",
      specs: {
        Processor: "Apple M3 Pro",
        RAM: "16GB",
        Storage: "512GB SSD",
        Display: "14-inch Liquid Retina XDR",
        OS: "macOS Sonoma",
      },
      features: [
        "Up to 18 hours battery life",
        "8-core CPU",
        "10-core GPU",
        "16-core Neural Engine",
        "Active cooling system",
      ],
      images: [
        { id: 11, url: i11, alt: "Front view" },
        { id: 12, url: i12, alt: "Side view" },
        { id: 13, url: i13, alt: "Back view" },
        { id: 14, url: i14, alt: "Detail view" },
      ],
    },
    102: {
      id: 102,
      name: "HP Victus Gaming Laptop",
      brand: "HP",
      price: "199,999",
      description: "High-performance gaming laptop",
      specs: {
        Processor: "AMD Ryzen 7 7840HS",
        RAM: "16GB DDR5",
        Storage: "1TB NVMe SSD",
        Display: "15.6-inch FHD 144Hz",
        GPU: "NVIDIA RTX 4060 8GB",
      },
      features: [
        "144Hz Refresh Rate",
        "RGB Backlit Keyboard",
        "NVIDIA DLSS Support",
        "Wi-Fi 6E",
        "Tempest Cooling",
      ],
      images: [
        { id: 21, url: i21, alt: "Front view" },
        { id: 22, url: i22, alt: "Side view" },
      ],
    },
    103: {
      id: 103,
      name: "ViewSonic Gaming Monitor",
      brand: "ViewSonic",
      price: "39,999",
      description: "27-inch 180Hz Gaming Monitor",
      specs: {
        Panel: "IPS",
        Resolution: "2560 x 1440",
        RefreshRate: "180Hz",
        Response: "1ms GtG",
        HDR: "HDR400",
      },
      features: [
        "180Hz Refresh Rate",
        "1ms Response Time",
        "AMD FreeSync Premium",
        "99% sRGB Color Coverage",
        "Height Adjustable Stand",
      ],
      images: [
        { id: 31, url: i31, alt: "Front view" },
        { id: 32, url: i32, alt: "Side view" },
        { id: 33, url: i33, alt: "Side view" },
      ],
    },
    104: {
      id: 104,
      name: "Razer DeathAdder",
      brand: "Razer",
      price: "6,999",
      description: "Wired Gaming Mouse with 16,000 DPI",
      specs: {
        Sensor: "Optical",
        DPI: "16,000",
        Buttons: "8 Programmable",
        Weight: "82g",
        Lighting: "Razer Chroma RGB",
      },
      features: [
        "16,000 DPI Optical Sensor",
        "Ergonomic Design",
        "Razer Chroma RGB",
        "8 Programmable Buttons",
        "On-board Memory",
      ],
      images: [
        { id: 41, url: i41, alt: "Front view" },
        { id: 42, url: i42, alt: "Side view" },
        { id: 43, url: i43, alt: "Side view" },
        { id: 44, url: i44, alt: "Side view" },
      ],
    },
    105: {
      id: 105,
      name: "Geforce RTX 4060",
      brand: "Nvidia",
      price: "99,999",
      description: "High-performance GPU for Gaming",
      specs: {
        VRAM: "8GB GDDR6",
        Cores: "3072 CUDA Cores",
        Boost: "2.46 GHz",
        Power: "115W TDP",
        Interface: "PCIe 4.0",
      },
      features: [
        "DLSS 3.0 Support",
        "Ray Tracing Cores",
        "8GB GDDR6 Memory",
        "PCIe 4.0",
        "DirectX 12 Ultimate",
      ],
      images: [
        { id: 51, url: i51, alt: "Front view" },
        { id: 52, url: i52, alt: "Side view" },
        { id: 53, url: i53, alt: "Back view" },
      ],
    },
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);

      if (parseInt(id) >= 101 && parseInt(id) <= 105) {
        setProduct(featuredProducts[id]);
        setLoading(false);
        return;
      }

      try {
        const productData = await productService.getProductById(id);
        setProduct(productData);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="error-alert">
        {error}
      </Alert>
    );
  }

  if (!product) {
    return <Alert severity="info">Product not found</Alert>;
  }

  const reviews = [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      date: "March 15, 2024",
      comment:
        "Excellent product! The performance is outstanding and build quality is premium.",
      avatar: "JD",
    },
    {
      id: 2,
      name: "Sarah Smith",
      rating: 4,
      date: "March 10, 2024",
      comment: "Great value for money. Battery life could be better though.",
      avatar: "SS",
    },
    {
      id: 3,
      name: "Mike Johnson",
      rating: 5,
      date: "March 5, 2024",
      comment: "Perfect for my development needs. Fast and reliable.",
      avatar: "MJ",
    },
  ];

  const productImages = [
    { id: 1, url: i11, alt: "Front view" },
    { id: 2, url: i21, alt: "Side view" },
    { id: 3, url: i31, alt: "Back view" },
    { id: 4, url: i41, alt: "Detail view" },
  ];

  const handleMouseMove = (e) => {
    if (isZoomed) {
      const { left, top, width, height } = e.target.getBoundingClientRect();
      const x = ((e.pageX - left) / width) * 100;
      const y = ((e.pageY - top) / height) * 100;
      setMousePosition({ x, y });
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      addToCart({
        id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        description: product.description,
      });
    }
  };

  return (
    <>
      <div className="product-detail-container">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="product-gallery">
                <div
                  className={`main-image-container ${isZoomed ? "zoomed" : ""}`}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={product?.images[activeImage]?.url}
                    alt={product?.images[activeImage]?.alt}
                    className="main-image"
                    style={
                      isZoomed
                        ? {
                            transform: "scale(1.35)",
                            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                          }
                        : {}
                    }
                  />
                </div>

                {product?.images.length > 1 && (
                  <div className="gallery-navigation">
                    <IconButton
                      onClick={handlePrevImage}
                      className="nav-button"
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleNextImage}
                      className="nav-button"
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </div>
                )}

                <div className="thumbnails-container">
                  {product?.images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`thumbnail ${
                        index === activeImage ? "active" : ""
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={image.url} alt={image.alt} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="product-info">
                <h1>{product.name}</h1>
                <div className="brand">{product.brand}</div>
                <p className="description">{product.description}</p>

                <div className="features-section">
                  <h3>Key Features</h3>
                  <ul className="features-list">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="purchase-section">
                  <div className="price">Rs. {product.price}</div>
                  <div className="action-buttons">
                    <button
                      className="add-to-cart-btn"
                      onClick={handleAddToCart}
                    >
                      <span>Add to Cart</span>
                      <AddShoppingCartRoundedIcon />
                    </button>
                    <button
                      className={`wishlist-btn ${
                        isInWishlist(product?.id) ? "wishlisted" : ""
                      }`}
                      onClick={() => {
                        if (isLoggedIn) {
                          if (isInWishlist(product?.id)) {
                            removeFromWishlist(product?.id);
                          } else {
                            addToWishlist(product);
                          }
                        } else {
                          setShowLoginModal(true);
                        }
                      }}
                    >
                      <span>
                        {isInWishlist(product?.id)
                          ? "Wishlisted"
                          : "Add to Wishlist"}
                      </span>
                      {isInWishlist(product?.id) ? (
                        <FavoriteIcon className="wishlisted" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="specs-container mt-5">
            <h3>Technical Specifications</h3>
            <div className="specs-grid">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reviews-section mt-4">
            <h3>Customer Reviews</h3>
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <Avatar className="review-avatar">{review.avatar}</Avatar>
                    <div className="review-meta">
                      <h4>{review.name}</h4>
                      <Rating value={review.rating} readOnly precision={0.5} />
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <h3>Please Login First</h3>
        <p>You need to be logged in to add items to your cart.</p>
        <div className="modal-buttons">
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ProductDetail;
