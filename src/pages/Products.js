import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';

import potImg1 from '../assets/pot1.jpg';
import jewelryImg1 from '../assets/jewels1.jpg';
import wallDecorImg1 from '../assets/wall1.jpg';
import woodBoxImg1 from '../assets/wood1.jpg';
import woolMakerImg1 from '../assets/wool1.jpg';
import candleImg1 from '../assets/candles.jpg';
import basketImg1 from '../assets/basket.jpg';
import embroideryImg1 from '../assets/embr.jpg';
import paperCraftImg1 from '../assets/paper.jpg';
import clayFigurineImg1 from '../assets/clay.jpg';
import glassPaintingImg1 from '../assets/glass.jpg';
import beadArtImg1 from '../assets/bead .jpg';
import terracottaImg1 from '../assets/plate.jpg';
import quillingImg1 from '../assets/quil.jpg';
import crochetImg1 from '../assets/doll.jpg';
import macrameImg1 from '../assets/hang.jpg';
import potImg2 from '../assets/pot2.jpg';
import potImg3 from '../assets/pot3.jpg';
import potImg4 from '../assets/pot4.jpg';
import potImg5 from '../assets/pot5.jpg';
import potImg6 from '../assets/pot6.jpg';
import potImg7 from '../assets/pot7.jpg';
import potImg8 from '../assets/pot8.jpg';
import potImg9 from '../assets/pot9.jpg';
import potImg10 from '../assets/pot10.jpg';
import potImg11 from '../assets/pot11.jpg';
import potImg12 from '../assets/pot12.jpg';
import potImg13 from '../assets/pot13.jpg';
import jewelryImg2 from '../assets/jewels2.jpg';
import jewelryImg3 from '../assets/jewels3.jpg';
import jewelryImg4 from '../assets/jewels4.jpg';
import jewelryImg5 from '../assets/jewels5.jpg';
import jewelryImg6 from '../assets/jewels6.jpg';
import jewelryImg7 from '../assets/jewels7.jpg';
import jewelryImg8 from '../assets/jewels8.jpg';
import jewelryImg9 from '../assets/jewels9.jpg';
import jewelryImg10 from '../assets/jewels10.jpg';
import jewelryImg11 from '../assets/jewels11.jpg';
import jewelryImg12 from '../assets/jewels12.jpg';
import jewelryImg13 from '../assets/jewels13.jpg';
import jewelryImg14 from '../assets/jewels14.jpg';
import wallDecorImg2 from '../assets/wall12.jpeg';
import wallDecorImg3 from '../assets/wall13.jpeg';
import wallDecorImg4 from '../assets/wall4.jpeg';
import wallDecorImg5 from '../assets/wall5.jpeg';
import wallDecorImg6 from '../assets/wall6.jpeg';
import wallDecorImg7 from '../assets/wall7.jpeg';
import wallDecorImg8 from '../assets/wall8.jpeg';
import wallDecorImg9 from '../assets/wall9.jpeg';
import wallDecorImg10 from '../assets/wall10.jpeg';
import wallDecorImg11 from '../assets/wall11.jpeg';
import wallDecorImg12 from '../assets/wall2.jpeg';
import wallDecorImg13 from '../assets/wall3.jpeg';
import wallDecorImg14 from '../assets/wall14.jpeg';
import woodBoxImg2 from '../assets/wood2.jpeg';
import woodBoxImg3 from '../assets/wood3.jpeg';
import woodBoxImg4 from '../assets/wood4.jpeg';
import woodBoxImg5 from '../assets/wood5.jpeg';
import woodBoxImg6 from '../assets/wood6.jpeg';
import woodBoxImg7 from '../assets/wood7.jpeg';
import woodBoxImg8 from '../assets/wood8.jpeg';
import woodBoxImg9 from '../assets/wood9.jpeg';
import woodBoxImg10 from '../assets/wood10.jpeg';
import woodBoxImg11 from '../assets/wood11.jpeg';
import woolMakerImg2 from '../assets/wool2.jpeg';
import woolMakerImg3 from '../assets/wool3.jpeg';
import woolMakerImg4 from '../assets/wool4.jpeg';
import woolMakerImg5 from '../assets/wool5.jpeg';
import woolMakerImg6 from '../assets/wool6.jpeg';
import woolMakerImg7 from '../assets/wool7.jpeg';
import woolMakerImg8 from '../assets/wool8.jpeg';
import woolMakerImg9 from '../assets/wool9.jpeg';
import woolMakerImg10 from '../assets/wool10.jpeg';
import woolMakerImg11 from '../assets/wool11.jpeg';
import woolMakerImg12 from '../assets/wool12.jpeg';

const products = [
  {
    id: 1,
    name: "Handmade Pot",
    images: [potImg1],
    price: 250
  },
  {
    id: 2,
    name: "Jewelry",
    images: [jewelryImg1],
    price: 500
  },
  {
    id: 3,
    name: "Wall Decor",
    images: [wallDecorImg1],
    price: 700
  },
  {
    id: 4,
    name: "Wood Box",
    images: [woodBoxImg1],
    price: 350
  },
  {
    id: 5,
    name: "Wool Maker",
    images: [woolMakerImg1],
    price: 400
  },
  {
    id: 6,
    name: "Scented Candle",
    images: [candleImg1],
    price: 200
  },
  {
    id: 7,
    name: "Woven Basket",
    images: [basketImg1],
    price: 300
  },
  {
    id: 8,
    name: "Embroidery Hoop",
    images: [embroideryImg1],
    price: 450
  },
  {
    id: 9,
    name: "Paper Craft",
    images: [paperCraftImg1],
    price: 150
  },
  {
    id: 10,
    name: "Clay Figurine",
    images: [clayFigurineImg1],
    price: 320
  },
  {
    id: 11,
    name: "Glass Painting",
    images: [glassPaintingImg1],
    price: 600
  },
  {
    id: 12,
    name: "Bead Art",
    images: [beadArtImg1],
    price: 280
  },
  {
    id: 13,
    name: "Terracotta Plate",
    images: [terracottaImg1],
    price: 370
  },
  {
    id: 14,
    name: "Quilling Art",
    images: [quillingImg1],
    price: 220
  },
  {
    id: 15,
    name: "Crochet Doll",
    images: [crochetImg1],
    price: 520
  },
  {
    id: 16,
    name: "Macrame Wall Hanging",
    images: [macrameImg1],
    price: 650
  },
  {
    id: 17,
    name: "Handmade Pot",
    images: [potImg2],
    price: 250
  },
  {
    id: 18,
    name: "Handmade Pot",
    images: [potImg3],
    price: 250
  },
  {
    id: 19,
    name: "Handmade Pot",
    images: [potImg4],
    price: 250
  },
  {
    id: 20,
    name: "Handmade Pot",
    images: [potImg5],
    price: 250
  },
  {
    id: 21,
    name: "Handmade Pot",
    images: [potImg6],
    price: 250
  },
  {
    id: 22,
    name: "Handmade Pot",
    images: [potImg7],
    price: 250
  },
  {
    id: 23,
    name: "Handmade Pot",
    images: [potImg8],
    price: 250
  },
  {
    id: 24,
    name: "Handmade Pot",
    images: [potImg9],
    price: 250
  },
  {
    id: 25,
    name: "Handmade Pot",
    images: [potImg10],
    price: 250
  },
  {
    id: 26,
    name: "Handmade Pot",
    images: [potImg11],
    price: 250
  },
  {
    id: 27,
    name: "Handmade Pot",
    images: [potImg12],
    price: 250
  },
  {
    id: 28,
    name: "Handmade Pot",
    images: [potImg13],
    price: 250
  },
  {
    id: 29,
    name: "Jewelry",
    images: [jewelryImg2],
    price: 500
  },
  {
    id: 30,
    name: "Jewelry",
    images: [jewelryImg3],
    price: 500
  },
  {
    id: 31,
    name: "Jewelry",
    images: [jewelryImg4],
    price: 500
  },
  {
    id: 32,
    name: "Jewelry",
    images: [jewelryImg5],
    price: 500
  },
  {
    id: 33,
    name: "Jewelry",
    images: [jewelryImg6],
    price: 500
  },
  {
    id: 34,
    name: "Jewelry",
    images: [jewelryImg7],
    price: 500
  },
  {
    id: 35,
    name: "Jewelry",
    images: [jewelryImg8],
    price: 500
  },
  {
    id: 36,
    name: "Jewelry",
    images: [jewelryImg9],
    price: 500
  },
  {
    id: 37,
    name: "Jewelry",
    images: [jewelryImg10],
    price: 500
  },
  {
    id: 38,
    name: "Jewelry",
    images: [jewelryImg11],
    price: 500
  },
  {
    id: 39,
    name: "Jewelry",
    images: [jewelryImg12],
    price: 500
  },
  {
    id: 40,
    name: "Jewelry",
    images: [jewelryImg13],
    price: 500
  },
  {
    id: 41,
    name: "Jewelry",
    images: [jewelryImg14],
    price: 500
  },
   {
    id: 42,
    name: "Wall Decor",
    images: [wallDecorImg2],
    price: 700
  },
   {
    id: 43,
    name: "Wall Decor",
    images: [wallDecorImg3],
    price: 700
  },
 
   {
    id: 44,
    name: "Wall Decor",
    images: [wallDecorImg4],
    price: 700
  },
  {
    id: 45,
    name: "Wall Decor",
    images: [wallDecorImg5],
    price: 700
  },
  {
    id: 46,
    name: "Wall Decor",
    images: [wallDecorImg6],
    price: 700
  },
  {
    id: 47,
    name: "Wall Decor",
    images: [wallDecorImg7],
    price: 700
  },
  {
    id: 48,
    name: "Wall Decor",
    images: [wallDecorImg8],
    price: 700
  },
  {
    id: 49,
    name: "Wall Decor",
    images: [wallDecorImg9],
    price: 700
  },
  {
    id: 50,
    name: "Wall Decor",
    images: [wallDecorImg10],
    price: 700
  },
  {
    id: 51,
    name: "Wall Decor",
    images: [wallDecorImg11],
    price: 700
  },
  {
    id: 52,
    name: "Wall Decor",
    images: [wallDecorImg12],
    price: 700
  },
  {
    id: 53,
    name: "Wall Decor",
    images: [wallDecorImg13],
    price: 700
  },
  {
    id: 54,
    name: "Wall Decor",
    images: [wallDecorImg14],
    price: 700
  },
   {
    id: 55,
    name: "Wood Box",
    images: [woodBoxImg2],
    price: 350
  },
   {
    id: 56,
    name: "Wood Box",
    images: [woodBoxImg3],
    price: 350
  },
   {
    id: 57,
    name: "Wood Box",
    images: [woodBoxImg4],
    price: 350
  },
   {
    id: 58,
    name: "Wood Box",
    images: [woodBoxImg5],
    price: 350
  },
   {
    id: 59,
    name: "Wood Box",
    images: [woodBoxImg6],
    price: 350
  },
   {
    id: 60,
    name: "Wood Box",
    images: [woodBoxImg7],
    price: 350
  },
   {
    id: 61,
    name: "Wood Box",
    images: [woodBoxImg8],
    price: 350
  },
   {
    id: 62,
    name: "Wood Box",
    images: [woodBoxImg9],
    price: 350
  },
   {
    id: 63,
    name: "Wood Box",
    images: [woodBoxImg10],
    price: 350
  },
   {
    id: 64,
    name: "Wood Box",
    images: [woodBoxImg11],
    price: 350
  },
  {
    id: 65,
    name: "Wool Maker",
    images: [woolMakerImg2],
    price: 400
  },
  {
    id: 66,
    name: "Wool Maker",
    images: [woolMakerImg3],
    price: 400
  },
  {
    id: 67,
    name: "Wool Maker",
    images: [woolMakerImg4],
    price: 400
  },
  {
    id: 68,
    name: "Wool Maker",
    images: [woolMakerImg5],
    price: 400
  },
  {
    id: 69,
    name: "Wool Maker",
    images: [woolMakerImg6],
    price: 400
  },
  {
    id: 70,
    name: "Wool Maker",
    images: [woolMakerImg7],
    price: 400
  },
  {
    id: 71,
    name: "Wool Maker",
    images: [woolMakerImg8],
    price: 400
  },
  {
    id: 72,
    name: "Wool Maker",
    images: [woolMakerImg9],
    price: 400
  },
  {
    id: 73,
    name: "Wool Maker",
    images: [woolMakerImg10],
    price: 400
  },
  {
    id: 74,
    name: "Wool Maker",
    images: [woolMakerImg11],
    price: 400
  },
  {
    id: 75,
    name: "Wool Maker",
    images: [woolMakerImg12],
    price: 400
  },
  
  
 
 
 
];


function Products({ onAddToCart }) {
  const [addedId, setAddedId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const productRefs = useRef(products.map(() => React.createRef()));
  const [savedForLater, setSavedForLater] = useState(() => new Set(JSON.parse(localStorage.getItem('savedForLater') || '[]')));
  const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem('reviews') || '{}')); // { productId: [{rating, text}] }
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    setAddedId(product.id);
    if (onAddToCart) {
      onAddToCart({
        ...product,
        image: product.images[0], // Ensure image is passed to cart
      });
    }
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleShortcutClick = (name) => {
    setSelectedName(name); // Filter by name
  };

  const toggleSaveForLater = (productId) => {
    const next = new Set(savedForLater);
    const isSaving = !next.has(productId);
    if (isSaving) next.add(productId); else next.delete(productId);
    setSavedForLater(next);
    localStorage.setItem('savedForLater', JSON.stringify(Array.from(next)));

    // Keep minimal product info for Cart display
    const data = JSON.parse(localStorage.getItem('savedItemsData') || '{}');
    if (isSaving) {
      const prod = products.find(p => p.id === productId);
      if (prod) {
        data[productId] = { id: prod.id, name: prod.name, price: prod.price, image: prod.images[0] };
      }
    } else {
      delete data[productId];
    }
    localStorage.setItem('savedItemsData', JSON.stringify(data));
  };

  const addReview = (productId, rating, text) => {
    const existing = reviews[productId] || [];
    const next = { ...reviews, [productId]: [...existing, { rating, text, at: Date.now() }] };
    setReviews(next);
    localStorage.setItem('reviews', JSON.stringify(next));
  };

  const averageRating = (productId) => {
    const list = reviews[productId] || [];
    if (list.length === 0) return 0;
    return Math.round((list.reduce((s, r) => s + Number(r.rating || 0), 0) / list.length) * 10) / 10;
  };

  const handleBuyNow = (product) => {
    localStorage.setItem('buyNow', JSON.stringify({ productId: product.id, name: product.name, price: product.price }));
    navigate('/payment');
  };

  const displayedProducts = (
    selectedName === null
      ? products
      : products.filter(product => product.name === selectedName)
  ).filter(p => (showSavedOnly ? savedForLater.has(p.id) : true));

  return (
    <div className="products-container">
      <aside className="products-sidebar">
        <h4>All Products</h4>
        <ul>
          {[...new Set(products.map(p => p.name))].map((name, idx) => (
            <li key={idx}>
              <button onClick={() => handleShortcutClick(name)}>
                {name}
              </button>
            </li>
          ))}
          <li>
            <button onClick={() => setSelectedName(null)} style={{ color: '#b05c0b', fontWeight: 600 }}>
              Show All
            </button>
          </li>
          <li style={{marginTop: '8px'}}>
            <button onClick={() => setShowSavedOnly(v => !v)} style={{ color: showSavedOnly ? '#0a7d27' : '#7b5e57', fontWeight: 600 }}>
              {showSavedOnly ? 'Showing: Saved for later' : 'Show Saved for later'}
            </button>
          </li>
        </ul>
      </aside>
      <div className="product-list">
        {displayedProducts.map((product, idx) => (
          <div className="product-card" key={product.id} ref={productRefs.current[product.id - 1]}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <div className="rating" title={`Average rating ${averageRating(product.id)}`}>
              {[1,2,3,4,5].map(star => (
                <span key={star} className="star">{averageRating(product.id) >= star ? '★' : '☆'}</span>
              ))}
              <span style={{marginLeft:6, fontSize:'0.85rem', color:'#555'}}>({averageRating(product.id)})</span>
            </div>
            <p>₹{product.price}</p>
            <button
              className={`add-to-cart-btn`}
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </button>
            <div className="product-actions">
              <button className="save-later-btn" onClick={() => toggleSaveForLater(product.id)}>
                {savedForLater.has(product.id) ? 'Saved' : 'Save for later'}
              </button>
            </div>
            <div className="reviews">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const rating = Number(formData.get('rating')) || 5;
                const text = String(formData.get('text') || '').trim();
                if (!text) return;
                addReview(product.id, rating, text);
                e.currentTarget.reset();
              }}>
                <div className="rating">
                  <select name="rating" defaultValue={5} style={{border:'1px solid #eee', borderRadius:6, padding:'4px 6px'}}>
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
                  </select>
                </div>
                <textarea name="text" placeholder="Write a review (will be saved locally)" />
                <button type="submit" className="add-to-cart-btn" style={{marginTop:8}}>Submit Review</button>
              </form>
              <div className="review-list">
                {(reviews[product.id] || []).slice().reverse().slice(0,3).map((r, i) => (
                  <div key={i}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)} - {r.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
