const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  // You can save to DB or send an email here
  res.json({ success: true, msg: 'Message received!' });
});

module.exports = router;