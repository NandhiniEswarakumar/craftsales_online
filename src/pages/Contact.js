import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/contact', form);
      setStatus('Message sent!');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <div className="contact-info-box">
        <div>
          <strong>Email:</strong>
          <a href="mailto:support@crafthub.com">support@crafthub.com</a>
        </div>
        <div>
          <strong>Phone:</strong>
          <a href="tel:+919876543210">+91 98765 43210</a>
        </div>
        <div>
          <strong>Address:</strong>
          <span>123, Artisan Street, Chennai, India</span>
        </div>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Send us a message</h2>
        <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
        <textarea name="message" placeholder="Your Message" rows={5} value={form.message} onChange={handleChange} required />
        <button type="submit">Send Message</button>
        {status && <div className="form-status">{status}</div>}
      </form>
    </div>
  );
};

export default Contact;