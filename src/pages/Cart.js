import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [showQRPayment, setShowQRPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const savedIds = useMemo(() => new Set(JSON.parse(localStorage.getItem('savedForLater') || '[]')), []);
  const savedItems = useMemo(() => {
    const map = JSON.parse(localStorage.getItem('savedItemsData') || '{}');
    return Array.from(savedIds).map((id) => map[id]).filter(Boolean);
  }, [savedIds]);

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getSavedTotal = () =>
    savedItems.reduce((sum, item) => sum + item.price, 0);

  // Unique feature: Smart Saver discount - the more you saved, the higher the unlock
  // 1+ saved = 5%, 3+ saved = 10%, 5+ saved = 12%
  const smartDiscountRate = savedItems.length >= 5 ? 0.12 : savedItems.length >= 3 ? 0.10 : savedItems.length >= 1 ? 0.05 : 0;
  const [applySmartDiscount, setApplySmartDiscount] = useState(true);
  const getFinalTotal = () => {
    const subtotal = getTotal();
    if (!applySmartDiscount) return subtotal;
    return subtotal * (1 - smartDiscountRate);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment', { 
        state: { 
          cartItems, 
          total: getTotal() 
        } 
      });
    }, 1000);
  };

  const handleQuickPay = () => {
    setShowQRPayment(true);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setIsProcessing(true);
    setPaymentMessage(`Opening ${method}...`);
    
    // Simulate opening payment app and showing QR
    setTimeout(() => {
      setPaymentMessage(`Scan QR code with ${method} to complete payment`);
      setIsProcessing(false);
    }, 1500);
  };

  const handlePaymentComplete = () => {
    setIsProcessing(true);
    setPaymentMessage('Payment Successful! 🎉 Redirecting...');
    
    setTimeout(() => {
      navigate('/order-confirmation', {
        state: {
          orderDetails: {
            items: cartItems,
            total: getTotal(),
            paymentMethod: selectedPaymentMethod,
            orderDate: new Date().toLocaleString()
          }
        }
      });
    }, 2000);
  };

  const handlePaymentCancel = () => {
    setShowQRPayment(false);
    setSelectedPaymentMethod('');
    setPaymentMessage('');
    setIsProcessing(false);
  };

  // Generate QR code URL (using QR code API)
 const generateQRCode = () => {
  const yourUPIId = "nandhinieswarakumar@okicici"; // Your UPI ID
  const yourName = "Nandhini EswaraKumar"; // Your name
  const transactionNote = `CraftHub Store Payment - Order #${Date.now()}`;
  
  const paymentInfo = `upi://pay?pa=${yourUPIId}&pn=${yourName}&am=${getTotal()}&cu=INR&tn=${transactionNote}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentInfo)}`;
};

  if (showQRPayment) {
    return (
      <div className="cart-page">
        <div className="qr-payment-container">
          <h2>Choose Payment Method</h2>
          
          {!selectedPaymentMethod ? (
            <div className="payment-methods">
              <button 
                className="payment-method-btn gpay"
                onClick={() => handlePaymentMethodSelect('Google Pay')}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" />
                <span>Google Pay</span>
              </button>
              
              <button 
                className="payment-method-btn phonepe"
                onClick={() => handlePaymentMethodSelect('PhonePe')}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/PhonePe_Logo.svg" alt="PhonePe" />
                <span>PhonePe</span>
              </button>
              
              <button 
                className="payment-method-btn paytm"
                onClick={() => handlePaymentMethodSelect('Paytm')}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.png" alt="Paytm" />
                <span>Paytm</span>
              </button>
            </div>
          ) : (
            <div className="qr-payment-section">
              <div className="payment-header">
                <h3>Pay with {selectedPaymentMethod}</h3>
                <div className="amount-display">₹{getTotal().toFixed(2)}</div>
              </div>
              
              {paymentMessage && (
                <div className={`payment-message ${paymentMessage.includes('Successful') ? 'success' : 'processing'}`}>
                  {paymentMessage}
                </div>
              )}
              
              {!isProcessing && (
                <div className="qr-code-section">
                  <div className="qr-code-container">
                    <img 
                      src={generateQRCode()} 
                      alt="Payment QR Code" 
                      className="qr-code"
                    />
                  </div>
                  <p className="qr-instructions">
                    1. Open {selectedPaymentMethod} app<br/>
                    2. Scan this QR code<br/>
                    3. Complete the payment
                  </p>
                  
                  <div className="qr-payment-actions">
                    <button 
                      className="payment-complete-btn"
                      onClick={handlePaymentComplete}
                    >
                      ✅ Payment Done
                    </button>
                    <button 
                      className="payment-cancel-btn"
                      onClick={handlePaymentCancel}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <button 
            className="back-to-cart-btn"
            onClick={handlePaymentCancel}
          >
            ← Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      
      {paymentMessage && (
        <div className={`payment-message ${paymentMessage.includes('Successful') ? 'success' : 'processing'}`}>
          {paymentMessage}
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button 
            className="go-back-btn"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.image}
                alt={item.name || item.title}
                className="cart-item__image"
              />
              <div className="cart-item__info">
                <h3>{item.title || item.name}</h3>
                <p>₹{item.price.toFixed(2)}</p>
                <div className="cart-item__controls">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} 
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button 
                    className="cart-item__remove" 
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="cart-summary">
            <div className="cart-total">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>₹{getTotal().toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              {smartDiscountRate > 0 && (
                <div className="summary-line">
                  <label style={{display:'flex', gap:8, alignItems:'center'}}>
                    <input type="checkbox" checked={applySmartDiscount} onChange={(e) => setApplySmartDiscount(e.target.checked)} />
                    Apply Smart Saver {Math.round(smartDiscountRate*100)}% discount
                  </label>
                </div>
              )}
              {applySmartDiscount && smartDiscountRate > 0 && (
                <div className="summary-line">
                  <span>Discount:</span>
                  <span>- ₹{(getTotal()*smartDiscountRate).toFixed(2)}</span>
                </div>
              )}
              <div className="summary-line total-line">
                <strong>Total: ₹{getFinalTotal().toFixed(2)}</strong>
              </div>
            </div>
            <div className="cart-total" style={{marginTop:'16px'}}>
              <h3>Saved for later</h3>
              {savedItems.length === 0 ? (
                <div className="summary-line">No items saved.</div>
              ) : (
                <div>
                  {savedItems.map(si => (
                    <div key={si.id} style={{display:'flex', alignItems:'center', gap:10, margin:'8px 0'}}>
                      <img src={si.image} alt={si.name} style={{width:48, height:48, objectFit:'cover', borderRadius:6}} />
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600}}>{si.name}</div>
                        <div>₹{Number(si.price).toFixed(2)}</div>
                      </div>
                      <button className="go-back-btn" onClick={() => {
                        // Move to cart quick action
                        navigate('/products');
                      }}>Buy</button>
                    </div>
                  ))}
                  <div className="summary-line total-line" style={{marginTop:8}}>
                    <strong>Saved value: ₹{getSavedTotal().toFixed(2)}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="cart-actions">
          <button
            className="go-back-btn"
            onClick={() => navigate('/products')}
            disabled={isProcessing}
          >
            ← Continue Shopping
          </button>
          
          <button
            className="quick-pay-btn"
            onClick={handleQuickPay}
            disabled={isProcessing}
          >
            💳 Quick Pay
          </button>
          
          <button
            className="buy-now-btn"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Loading...' : '🛒 Checkout'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;