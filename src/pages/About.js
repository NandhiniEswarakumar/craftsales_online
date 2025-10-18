import React from 'react';
import './About.css';

const About = () => (
  <div className="about-page">
    <section className="about-hero">
      <h1>About CraftHub</h1>
      <p>
        Welcome to <span className="brand">CraftHub</span>, your destination for unique, handmade crafts created with passion and skill by talented artisans. We believe in the beauty of handcrafted products and the stories they tell.
      </p>
    </section>
    <section className="about-section">
      <h2>Our Mission</h2>
      <p>
        Our mission is to connect craft lovers with the finest handmade products, supporting local artists and promoting sustainable, ethical shopping. Every item on CraftHub is carefully curated for quality and authenticity.
      </p>
    </section>
    <section className="about-section">
      <h2>Why Choose Us?</h2>
      <div className="about-features">
        <div className="feature-card">
          <span role="img" aria-label="variety">🎨</span>
          <h3>Wide Variety</h3>
          <p>Discover a diverse range of authentic handmade crafts from skilled artisans.</p>
        </div>
        <div className="feature-card">
          <span role="img" aria-label="support">🤝</span>
          <h3>Support Artisans</h3>
          <p>Every purchase directly supports independent creators and their communities.</p>
        </div>
        <div className="feature-card">
          <span role="img" aria-label="secure">🔒</span>
          <h3>Secure Shopping</h3>
          <p>Enjoy a safe, seamless, and transparent shopping experience.</p>
        </div>
        <div className="feature-card">
          <span role="img" aria-label="service">🚚</span>
          <h3>Fast Delivery</h3>
          <p>Quick shipping and responsive customer service for your peace of mind.</p>
        </div>
      </div>
    </section>
    <section className="about-section">
      <h2>Meet Our Artisans</h2>
      <p>
        Our community of artisans brings together traditional techniques and modern creativity. Each product is a reflection of their dedication and love for their craft.
      </p>
    </section>
    
  </div>
);

export default About;