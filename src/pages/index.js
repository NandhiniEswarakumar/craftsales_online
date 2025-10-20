import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Homepage() {
  // const username = localStorage.getItem("username");
  // const navigate = useNavigate();

  // const handleLogout = async () => {
  //   await fetch("http://localhost:5001/api/logout", {
  //     method: "POST",
  //     credentials: "include",
  //   });
  //   localStorage.removeItem("user");
  //   navigate("/login");
  // };

  return (
    <div className="homepage-background">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to CraftHub</h1>
          <p className="hero-subtitle">Discover Amazing Handmade Crafts</p>
          <p className="hero-description">
            Connect with talented artisans from around the world and find unique,
            handcrafted items that tell a story. From pottery to textiles,
            jewelry to furniture - every piece is made with love and care.
          </p>
          <div className="hero-buttons">
            <Link className="cta-primary" to="/signup">
              Get Started
            </Link>
            <Link className="cta-secondary" to="/products">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&h=500&fit=crop"
            alt="Beautiful handmade crafts display"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-sections">
        <div className="container">
          <h2>Why Choose CraftHub?</h2>
          <div className="features-grid">
            <div className="featured-card">
              <div className="feature-icon">🌟</div>
              <h3>Authentic Handmade</h3>
              <p>
                Every item is carefully crafted by skilled artisans using
                traditional techniques and premium materials.
              </p>
            </div>
            <div className="featured-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Artisans</h3>
              <p>
                Support creators from around the world and discover unique
                cultural crafts and traditions.
              </p>
            </div>
            <div className="featured-card">
              <div className="feature-icon">♻️</div>
              <h3>Sustainable Materials</h3>
              <p>
                Eco-friendly and sustainable materials ensure your purchase
                supports a better planet.
              </p>
            </div>
            <div className="featured-card">
              <div className="feature-icon">💝</div>
              <h3>Unique & Special</h3>
              <p>
                Find one-of-a-kind pieces that you won't see anywhere else,
                perfect for gifts or personal collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="preview-section">
        <div className="container">
          <h2>Featured Categories</h2>
          <div className="preview-grid">
            <div className="preview-card">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=250&fit=crop"
                alt="Pottery"
              />
              <h3>Pottery & Ceramics</h3>
              <p>Beautiful handcrafted pottery pieces</p>
            </div>
            <div className="preview-card">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=250&fit=crop"
                alt="Textiles"
              />
              <h3>Textiles & Fabrics</h3>
              <p>Handwoven and embroidered textiles</p>
            </div>
            <div className="preview-card">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=250&fit=crop"
                alt="Jewelry"
              />
              <h3>Handmade Jewelry</h3>
              <p>Unique jewelry pieces and accessories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Explore?</h2>
          <p>
            Join our community of craft lovers and start discovering amazing
            handmade treasures today!
          </p>
          <Link className="cta-large" to="/signup">
            Join CraftHub Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
