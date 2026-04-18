import React from "react";
import ProductCard from "./ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./../components-css/Home.css";

import img1 from "../images/s-l1200.jpg";
import img2 from "../images/274.jpg";
import img3 from "../images/Best-24-inch-Monitors.jpg";

import i11 from "../images/product-images/product1-image/22-czone.com.pk-1540-15686-010224084552.jpg";
import i21 from "../images/product-images/product2-image/6-czone.com.pk-1540-17301-131124112143.jpg";
import i31 from "../images/product-images/product3-image/21-czone.com.pk-1540-15929-070524072032.jpg";
import i41 from "../images/product-images/product4-image/52-czone.com.pk-1540-12064-210223095208.jpg";
import i51 from "../images/product-images/product5-image/6-czone.com.pk-1-1540-15343-111023080631.jpg";

const products = [
  {
    id: 101,
    name: "Macbook Pro M3 Chip",
    brand: "Apple",
    price: "744,900",
    description: "Premium Laptop for Professionals",
    image: i11,
  },
  {
    id: 102,
    name: "HP Victus Gaming Laptop",
    brand: "HP",
    price: "199,999",
    description: "High-performance gaming laptop",
    image: i21,
  },
  {
    id: 103,
    name: "ViewSonic Gaming Monitor",
    brand: "ViewSonic",
    price: "39,999",
    description: "27-inch 180Hz Gaming Monitor",
    image: i31,
  },
  {
    id: 104,
    name: "Razer DeathAdder",
    brand: "Razer",
    price: "6,999",
    description: "Wired Gaming Mouse with 16,000 DPI",
    image: i41,
  },
  {
    id: 105,
    name: "Geforce RTX 4060",
    brand: "Nvidia",
    price: "99,999",
    description: "High-performance GPU for Gaming",
    image: i51,
  },
];

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="home-page">
      <div className="carousel-container">
        <div
          id="mainCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#mainCarousel"
              data-bs-slide-to="0"
              className="active"
            ></button>
            <button
              type="button"
              data-bs-target="#mainCarousel"
              data-bs-slide-to="1"
            ></button>
            <button
              type="button"
              data-bs-target="#mainCarousel"
              data-bs-slide-to="2"
            ></button>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#mainCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#mainCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={img1} className="d-block w-100" alt="Gaming Laptop" />
              <div className="carousel-caption">
                <h2>Latest Premium Laptops</h2>
                <p>Discover our range of high-performance machines</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src={img2} className="d-block w-100" alt="..." />
              <div className="carousel-caption">
                <h2>Custom PC Builds</h2>
                <p>Build your dream PC with our premium components</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src={img3} className="d-block w-100" alt="..." />
              <div className="carousel-caption">
                <h2>Monitors with Beautiful Display</h2>
                <p>
                  Experience stunning visuals with our high-quality display
                  collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <section className="new-arrivals">
        <div className="arrivals-banner">
          <h3>New Arrivals</h3>
        </div>
        <Slider {...settings} className="products-slider">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </Slider>
      </section>

      <section className="newsletter">
        <div className="container text-center">
          <h2>Stay Updated</h2>
          <p>
            Subscribe to our newsletter for latest updates and exclusive offers
          </p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
