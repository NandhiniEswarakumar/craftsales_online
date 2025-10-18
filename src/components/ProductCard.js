import React from 'react';
import './Products.css';

const ProductCard = ({ product, onAddToCart }) => (
  <div className="product-card">
    <img src={product.image} alt={product.title} className="product-card__image" />
    <h3 className="product-card__title">{product.title}</h3>
    <p className="product-card__price">₹{product.price.toFixed(2)}</p>
    <button className="product-card__button" onClick={() => onAddToCart(product)}>
      Add to Cart
    </button>
  </div>
);

export default ProductCard;
