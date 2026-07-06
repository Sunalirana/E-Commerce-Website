const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample products data
const products = [
  {
    _id: '1',
    name: "Eco-Friendly Water Bottle",
    description: "Reusable stainless steel water bottle that keeps drinks cold for 24 hours and hot for 12 hours.",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    price: 29.99,
    tags: ["eco-friendly", "reusable", "stainless steel"],
    isEcoFriendly: true
  },
  {
    _id: '2',
    name: "Organic Cotton T-Shirt",
    description: "Soft, comfortable t-shirt made from 100% organic cotton.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    price: 24.99,
    tags: ["organic", "cotton", "clothing"],
    isEcoFriendly: true
  },
  {
    _id: '3',
    name: "Bamboo Phone Case",
    description: "Protective phone case made from sustainable bamboo.",
    imageUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
    price: 19.99,
    tags: ["bamboo", "phone case", "sustainable"],
    isEcoFriendly: true
  }
];

// Routes
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'OK', products: products.length });
});

app.get('/api/products', (req, res) => {
  console.log('Products requested');
  res.json(products);
});

app.get('/api/orders/sold-products', (req, res) => {
  console.log('Sold products requested');
  res.json([
    { ...products[0], soldQuantity: 3 },
    { ...products[1], soldQuantity: 2 }
  ]);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📡 Test: http://localhost:${PORT}/health`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
});
