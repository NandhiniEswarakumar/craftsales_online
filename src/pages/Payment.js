import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Payment() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    pincode: '',
    street: '',
    paymentMethod: '',
    amount: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Prefill amount when coming from Buy Now
  React.useEffect(() => {
    try {
      const buyNow = JSON.parse(localStorage.getItem('buyNow') || 'null');
      if (buyNow && buyNow.price) {
        setForm((f) => ({ ...f, amount: String(buyNow.price) }));
      }
    } catch {}
  }, []);

  const UPI_ID = process.env.REACT_APP_UPI_ID || 'your-upi-id@oksbi';
  const UPI_NAME = process.env.REACT_APP_UPI_NAME || 'CraftHub';

  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: UPI_NAME,
      cu: 'INR'
    });
    if (form.amount) params.set('am', String(form.amount));
    return `upi://pay?${params.toString()}`;
  }, [form.amount]);

  async function handleRazorpay() {
    const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!ok) {
      alert('Failed to load Razorpay. Check your internet connection.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/pay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.max(1, parseInt(form.amount || 1, 10)) })
      });
      const data = await res.json();
      if (!data.order) throw new Error('Order not created');

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxx',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'CraftHub',
        description: 'Craft purchase',
        order_id: data.order.id,
        handler: function () {
          navigate('/order-confirmation');
        },
        prefill: {
          name: form.name || 'Buyer',
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment initialization failed.');
      // Fallback: allow order confirmation to proceed for demo
      navigate('/order-confirmation');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.paymentMethod === 'UPI') {
      window.location.href = upiLink; // Open any UPI app (GPay/PhonePe/Paytm BHIM)
      setTimeout(() => navigate('/order-confirmation'), 2500);
    } else if (form.paymentMethod === 'Cash on Delivery') {
      navigate('/order-confirmation');
    } else if (form.paymentMethod === 'Card (Demo)') {
      alert('Demo card payment: no real charge. Order confirmed.');
      navigate('/order-confirmation');
    } else if (form.paymentMethod === 'Razorpay') {
      handleRazorpay();
    } else {
      alert('Please select a payment method.');
    }
  };

  return (  
    <div className="payment-container">
      <h2>Checkout</h2>
      <form className="payment-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Address
          <textarea name="address" value={form.address} onChange={handleChange} required />
        </label>
        <label>
          Pincode
          <input name="pincode" value={form.pincode} onChange={handleChange} required maxLength={6} />
        </label>
        <label>
          Street
          <input name="street" value={form.street} onChange={handleChange} required />
        </label>
        <label>
          Amount (optional)
          <input name="amount" type="number" min="1" value={form.amount} onChange={handleChange} placeholder="e.g. 999" />
        </label>
        <label>
          Payment Method
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="UPI">UPI (Any app)</option>
            <option value="Razorpay">Razorpay (UPI/Cards/Netbanking)</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Card (Demo)">Card (Demo)</option>
          </select>
        </label>
        {form.paymentMethod === 'UPI' && (
          <div style={{margin: '12px 0', display: 'grid', placeItems: 'center', gap: 8}}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}`}
              alt="UPI QR"
              style={{background:'#fff', padding:6, borderRadius:8, border:'1px solid #eee'}}
            />
            <div style={{fontSize:12, color:'#555'}}>Scan with GPay/PhonePe/Paytm or tap the button below.</div>
            {UPI_ID.includes('your-upi-id') && (
              <div style={{fontSize:12, color:'#c00'}}>Set REACT_APP_UPI_ID to a valid UPI ID (e.g., myname@oksbi).</div>
            )}
            <a href={upiLink} className="place-order-btn" style={{textDecoration:'none', textAlign:'center'}}>
              Pay with UPI
            </a>
          </div>
        )}
        <button type="submit" className="place-order-btn">Place Order</button>
      </form>
    </div>
  );
}

export default Payment;