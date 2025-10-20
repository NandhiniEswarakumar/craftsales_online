import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Seller.css';
import productNames from '../data/productNames';
import resolveImageUrl from '../utils/imageUtils';

  // Set the base URL for axios
  const API_BASE = 'http://localhost:5001';

  const Seller = ({ user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [imageInputType, setImageInputType] = useState('upload'); // 'upload' or 'url'
    const [lowStockThreshold, setLowStockThreshold] = useState(5);
    const [search, setSearch] = useState('');
    
    // Product form state
    const [productForm, setProductForm] = useState({
      title: '',
      description: '',
      price: '',
      image: '',
      category: '',
      stock: ''
    });

    // Debug function
    const debugLog = (message, data) => {
      console.log(`[SELLER DEBUG] ${message}`, data);
    };

    // Fetch seller data
    const fetchProducts = useCallback(async () => {
      try {
        setLoading(true);
        debugLog('Fetching products for user ID:', user.id);
        const response = await axios.get(`${API_BASE}/api/seller/products/${user.id}`);
        debugLog('Products response:', response.data);
        setProducts(response.data);
      } catch (error) {
        debugLog('Error fetching products:', error);
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }, [user?.id]);

    const fetchStats = useCallback(async () => {
      try {
        debugLog('Fetching stats for user ID:', user.id);
        const response = await axios.get(`${API_BASE}/api/seller/dashboard/${user.id}`);
        debugLog('Stats response:', response.data);
        setStats(response.data);
      } catch (error) {
        debugLog('Error fetching stats:', error);
        console.error('Error fetching stats:', error);
      }
    }, [user?.id]);

    useEffect(() => {
      if (user && user.id) {
        debugLog('User found:', user);
        fetchProducts();
        fetchStats();
      }
    }, [user, fetchProducts, fetchStats]);

    // Export products to CSV
    const exportToCSV = () => {
      const headers = ['Title','Description','Price','Image','Category','Stock','Active'];
      const rows = products.map(p => [p.title, p.description, p.price, p.image, p.category, p.stock, p.isActive !== false]);
      const csv = [headers, ...rows]
        .map(r => r.map(x => `"${String(x ?? '').replace(/"/g,'""')}"`).join(','))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const toggleActive = async (product) => {
      try {
        const updated = { isActive: !(product.isActive !== false), sellerId: user.id };
        await axios.put(`${API_BASE}/api/seller/products/${product._id}`, updated);
        await fetchProducts();
        await fetchStats();
      } catch (err) {
        alert('Failed to update product status');
      }
    };

    // Handle image file selection
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        debugLog('Image selected:', file.name);
        setImageFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        // Clear URL input
        setProductForm({...productForm, image: ''});
      }
    };

    // Handle image URL input
    const handleImageUrlChange = (e) => {
      const url = e.target.value;
      setProductForm({...productForm, image: url});
      setImagePreview(url);
      // Clear file input
      setImageFile(null);
    };

    // Handle image input type toggle
    const handleImageInputTypeChange = (type) => {
      setImageInputType(type);
      setImageFile(null);
      setImagePreview('');
      setProductForm({...productForm, image: ''});
    };

    // Upload image to server
    const uploadImage = async (file) => {
      try {
        debugLog('Uploading image:', file.name);
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await axios.post(`${API_BASE}/api/upload/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        debugLog('Image upload response:', response.data);
        return response.data.imageUrl;
      } catch (error) {
        debugLog('Error uploading image:', error);
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
      }
    };

    const handleProductSubmit = async (e) => {
      e.preventDefault();
      debugLog('Form submitted with data:', productForm);
      debugLog('Current user:', user);
      
      try {
        setLoading(true);
        
        let imageUrl = productForm.image;
        
        // Upload new image if file is selected
        if (imageFile) {
          debugLog('Uploading image file...');
          imageUrl = await uploadImage(imageFile);
          debugLog('Image uploaded, URL:', imageUrl);
        }
        
        const productData = {
          ...productForm,
          image: imageUrl || 'https://via.placeholder.com/300x200?text=No+Image',
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          sellerId: user.id,
          sellerName: user.username || 'Seller'
        };

        debugLog('Sending product data:', productData);

        if (editingProduct) {
          const response = await axios.put(`${API_BASE}/api/seller/products/${editingProduct._id}`, productData);
          debugLog('Product updated:', response.data);
          alert('Product updated successfully!');
        } else {
          const response = await axios.post(`${API_BASE}/api/seller/products`, productData);
          debugLog('Product added:', response.data);
          alert('Product added successfully!');
        }

        // Reset form and refresh
        resetForm();
        await fetchProducts();
        await fetchStats();
        
      } catch (error) {
        debugLog('Error saving product:', error);
        console.error('Error saving product:', error);
        alert('Failed to save product: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    const handleEditProduct = (product) => {
      debugLog('Editing product:', product);
      setProductForm({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        category: product.category,
        stock: product.stock.toString()
      });
      setImagePreview(product.image);
      setImageFile(null);
      setImageInputType('url'); // Default to URL when editing
      setEditingProduct(product);
      setShowAddProduct(true);
    };

    const handleDeleteProduct = async (productId) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        try {
          debugLog('Deleting product:', productId);
          await axios.delete(`${API_BASE}/api/seller/products/${productId}`, {
            data: { sellerId: user.id }
          });
          debugLog('Product deleted successfully');
          await fetchProducts();
          await fetchStats();
          alert('Product deleted successfully!');
        } catch (error) {
          debugLog('Error deleting product:', error);
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        }
      }
    };

    const resetForm = () => {
      setProductForm({
        title: '', description: '', price: '', image: '', category: '', stock: ''
      });
      setImageFile(null);
      setImagePreview('');
      setImageInputType('upload');
      setShowAddProduct(false);
      setEditingProduct(null);
    };

    return (
      <div className="seller-page">
        <div className="seller-header">
          <h1>Seller Dashboard</h1>
          <p>Welcome, {user?.username}!</p>
          <small style={{color: 'white', opacity: 0.8}}>User ID: {user?.id}</small>
        </div>

        {/* Navigation Tabs */}
        <div className="seller-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            📦 Products
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Products</h3>
                <div className="stat-number">{stats.totalProducts || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Active Products</h3>
                <div className="stat-number">{stats.activeProducts || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Out of Stock</h3>
                <div className="stat-number">{stats.outOfStock || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Low Stock</h3>
                <div className="stat-number">{stats.lowStock || 0}</div>
              </div>
            </div>
            <div style={{marginTop:'1.5rem', display:'flex', gap:'12px', alignItems:'center'}}>
              <label style={{display:'flex', alignItems:'center', gap:8}}>
                Low stock threshold
                <input type="number" min="0" value={lowStockThreshold} onChange={(e)=>setLowStockThreshold(parseInt(e.target.value||'0'))} style={{width:80, padding:6}} />
              </label>
              <button className="add-product-btn" onClick={exportToCSV}>⬇ Export CSV</button>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-content">
            <div className="products-header">
              <h2>My Products</h2>
              <button 
                className="add-product-btn"
                onClick={() => {
                  debugLog('Add Product button clicked');
                  setEditingProduct(null);
                  // Initialize a fresh form but KEEP the modal open
                  setProductForm({ title: '', description: '', price: '', image: '', category: '', stock: '' });
                  setImageFile(null);
                  setImagePreview('');
                  setImageInputType('upload');
                  setShowAddProduct(true);
                }}
              >
                + Add Product
              </button>
              <input
                placeholder="Search..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                style={{padding:'8px 10px', border:'1px solid #eee', borderRadius:8}}
              />
            </div>

            {/* Add/Edit Product Form */}
            {showAddProduct && (
              <div className="product-form-modal">
                <div className="product-form">
                  <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <form onSubmit={handleProductSubmit}>
                    <input
                      type="text"
                      placeholder="Product Title"
                      value={productForm.title}
                      onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                      required
                    />
                    <textarea
                      placeholder="Product Description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      required
                    />
                    
                    {/* Image Input Section */}
                    <div className="image-section">
                      <h4>Product Image</h4>
                      
                      {/* Image Input Type Selector */}
                      <div className="image-input-selector">
                        <button
                          type="button"
                          className={imageInputType === 'upload' ? 'active' : ''}
                          onClick={() => handleImageInputTypeChange('upload')}
                        >
                          📁 Upload from Computer
                        </button>
                        <button
                          type="button"
                          className={imageInputType === 'url' ? 'active' : ''}
                          onClick={() => handleImageInputTypeChange('url')}
                        >
                          🔗 Image URL
                        </button>
                      </div>

                      {/* File Upload Option */}
                      {imageInputType === 'upload' && (
                        <div className="image-upload-section">
                          <label htmlFor="image-upload" className="image-upload-label">
                            📸 Click to Browse and Upload Image
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="image-upload-input"
                          />
                          <small className="image-help-text">
                            Supported formats: JPG, PNG, GIF (Max 5MB)
                          </small>
                        </div>
                      )}

                      {/* URL Input Option */}
                      {imageInputType === 'url' && (
                        <div className="image-url-section">
                          <input
                            type="url"
                            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                            value={productForm.image}
                            onChange={handleImageUrlChange}
                            className="image-url-input"
                          />
                          <small className="image-help-text">
                            Enter a direct link to your product image
                          </small>
                        </div>
                      )}
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="image-preview">
                          <h5>Image Preview:</h5>
                          <img src={imagePreview} alt="Preview" />
                          <button 
                            type="button" 
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview('');
                              setProductForm({...productForm, image: ''});
                            }}
                            className="remove-image-btn"
                          >
                            ❌ Remove Image
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      {productNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                      required
                    />
                    <div className="form-actions">
                      <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Add Product')}
                      </button>
                      <button type="button" onClick={resetForm}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="products-grid">
              {loading ? (
                <p>Loading products...</p>
              ) : products.length === 0 ? (
                <p>No products yet. Add your first product!</p>
              ) : (
                products
                  .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
                  .map(product => (
                  <div key={product._id} className="product-card">
                    <img
                      src={resolveImageUrl(product.image)}
                      alt={product.title}
                      onError={(e) => { e.currentTarget.src = `${process.env.PUBLIC_URL}/fallback.png`; }}
                    />
                    <div className="product-info">
                      <h4>{product.title}</h4>
                      <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
                        <span className="price-badge">₹{product.price}</span>
                        <span className="stock-badge">Stock: {product.stock} {product.stock <= lowStockThreshold ? '⚠️' : ''}</span>
                      </div>
                      <div className="product-actions">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => toggleActive(product)}
                          className="edit-btn"
                        >
                          {product.isActive === false ? 'Activate' : 'Deactivate'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  export default Seller;