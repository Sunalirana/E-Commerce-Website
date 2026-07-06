const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-domain.com'] // Replace with your actual domain
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// In-memory data store for demo purposes
global.products = [
  {
    _id: '1',
    name: "Eco-Friendly Water Bottle",
    description: "Reusable stainless steel water bottle that keeps drinks cold for 24 hours and hot for 12 hours. Perfect for daily hydration and reducing plastic waste.",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    price: 29.99,
    tags: ["eco-friendly", "reusable", "stainless steel", "hydration"],
    isEcoFriendly: true
  },
  {
    _id: '2',
    name: "Organic Cotton T-Shirt",
    description: "Soft, comfortable t-shirt made from 100% organic cotton. Available in multiple colors. Ethically sourced and fair trade certified.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    price: 24.99,
    tags: ["organic", "cotton", "clothing", "fair trade"],
    isEcoFriendly: true
  },
  {
    _id: '3',
    name: "Bamboo Phone Case",
    description: "Protective phone case made from sustainable bamboo. Compatible with most phone models. Naturally antimicrobial and biodegradable.",
    imageUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
    price: 19.99,
    tags: ["bamboo", "phone case", "sustainable", "biodegradable"],
    isEcoFriendly: true
  },
  {
    _id: '4',
    name: "Solar Power Bank",
    description: "Portable solar-powered charger for your devices. Perfect for outdoor adventures. 20,000mAh capacity with fast charging technology.",
    imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    price: 49.99,
    tags: ["solar", "power bank", "portable", "outdoor"],
    isEcoFriendly: true
  },
  {
    _id: '5',
    name: "Recycled Notebook",
    description: "High-quality notebook made from 100% recycled paper. Perfect for journaling or note-taking. Includes plantable seed paper bookmark.",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    price: 12.99,
    tags: ["recycled", "notebook", "paper", "plantable"],
    isEcoFriendly: true
  },
  {
    _id: '6',
    name: "LED Desk Lamp",
    description: "Energy-efficient LED desk lamp with adjustable brightness and color temperature. USB charging port included for convenience.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    price: 39.99,
    tags: ["LED", "desk lamp", "energy efficient", "USB"],
    isEcoFriendly: false
  },
  {
    _id: '7',
    name: "Reusable Food Wraps",
    description: "Set of 3 beeswax food wraps in different sizes. Perfect alternative to plastic wrap. Keeps food fresh naturally.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    price: 18.99,
    tags: ["beeswax", "food wrap", "reusable", "kitchen"],
    isEcoFriendly: true
  },
  {
    _id: '8',
    name: "Bamboo Toothbrush Set",
    description: "Pack of 4 biodegradable bamboo toothbrushes with soft bristles. Plastic-free oral care for the whole family.",
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400",
    price: 15.99,
    tags: ["bamboo", "toothbrush", "biodegradable", "oral care"],
    isEcoFriendly: true
  },
  {
    _id: '9',
    name: "Organic Hemp Backpack",
    description: "Durable backpack made from organic hemp fiber. Water-resistant and perfect for daily commute or hiking adventures.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    price: 79.99,
    tags: ["hemp", "backpack", "organic", "water-resistant"],
    isEcoFriendly: true
  },
  {
    _id: '10',
    name: "Stainless Steel Lunch Box",
    description: "Leak-proof stainless steel lunch container with compartments. BPA-free and dishwasher safe. Perfect for meal prep.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    price: 34.99,
    tags: ["stainless steel", "lunch box", "BPA-free", "meal prep"],
    isEcoFriendly: true
  },
  {
    _id: '11',
    name: "Eco-Friendly Yoga Mat",
    description: "Non-toxic yoga mat made from natural rubber and cork. Provides excellent grip and cushioning for all yoga practices.",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    price: 68.99,
    tags: ["yoga", "natural rubber", "cork", "non-toxic"],
    isEcoFriendly: true
  },
  {
    _id: '12',
    name: "Seed Starter Kit",
    description: "Complete kit for growing your own herbs and vegetables. Includes organic seeds, biodegradable pots, and growing guide.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    price: 22.99,
    tags: ["seeds", "gardening", "organic", "herbs"],
    isEcoFriendly: true
  },
  {
    _id: '13',
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Made with recycled materials and energy-efficient design.",
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
    price: 45.99,
    tags: ["wireless charging", "recycled materials", "Qi-enabled", "fast charging"],
    isEcoFriendly: true
  },
  {
    _id: '14',
    name: "Compostable Phone Case",
    description: "Fully compostable phone case made from plant-based materials. Breaks down naturally in 6 months when composted.",
    imageUrl: "https://images.unsplash.com/photo-1601593346740-925612772716?w=400",
    price: 27.99,
    tags: ["compostable", "plant-based", "phone case", "biodegradable"],
    isEcoFriendly: true
  },
  {
    _id: '15',
    name: "Sustainable Sneakers",
    description: "Comfortable sneakers made from recycled ocean plastic and organic cotton. Stylish and environmentally conscious footwear.",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    price: 89.99,
    tags: ["sneakers", "recycled plastic", "ocean plastic", "footwear"],
    isEcoFriendly: true
  },
  {
    _id: '16',
    name: "Glass Water Bottles Set",
    description: "Set of 2 borosilicate glass water bottles with silicone sleeves. Heat-resistant and perfect for hot or cold beverages.",
    imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400",
    price: 42.99,
    tags: ["glass", "water bottle", "borosilicate", "heat-resistant"],
    isEcoFriendly: true
  },
  {
    _id: '17',
    name: "Organic Cotton Tote Bag",
    description: "Spacious tote bag made from certified organic cotton. Perfect for grocery shopping and daily errands. Machine washable.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    price: 16.99,
    tags: ["organic cotton", "tote bag", "shopping", "machine washable"],
    isEcoFriendly: true
  },
  {
    _id: '18',
    name: "Solar Garden Lights",
    description: "Set of 6 solar-powered LED garden lights. Automatic on/off with dusk sensor. Weather-resistant and easy installation.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    price: 35.99,
    tags: ["solar", "garden lights", "LED", "weather-resistant"],
    isEcoFriendly: true
  },
  {
    _id: '19',
    name: "Bamboo Cutting Board Set",
    description: "Set of 3 bamboo cutting boards in different sizes. Naturally antimicrobial and knife-friendly. Includes hanging loops.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    price: 28.99,
    tags: ["bamboo", "cutting board", "antimicrobial", "kitchen"],
    isEcoFriendly: true
  },
  {
    _id: '20',
    name: "Eco-Friendly Cleaning Kit",
    description: "Complete cleaning kit with plant-based cleaners and reusable microfiber cloths. Safe for family and pets.",
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400",
    price: 31.99,
    tags: ["cleaning", "plant-based", "microfiber", "family-safe"],
    isEcoFriendly: true
  }
];

global.users = [
  {
    _id: 'demo-user-1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: '$2b$10$yOEr0gmTkbkpZIa8ei.Qcerr0qdamnh9Ngp2Pi0utoiNtiQqXOw/e', // password: demo123
    points: 150,
    history: []
  }
];
global.orders = [
  {
    _id: 'order-1',
    user: 'demo-user-1',
    items: [
      { _id: '1', name: 'Eco-Friendly Water Bottle', price: 29.99, quantity: 2 },
      { _id: '3', name: 'Bamboo Phone Case', price: 19.99, quantity: 1 }
    ],
    total: 79.97,
    createdAt: new Date('2024-01-15')
  },
  {
    _id: 'order-2',
    user: 'demo-user-1',
    items: [
      { _id: '2', name: 'Organic Cotton T-Shirt', price: 24.99, quantity: 3 },
      { _id: '4', name: 'Solar Power Bank', price: 49.99, quantity: 1 }
    ],
    total: 124.96,
    createdAt: new Date('2024-01-20')
  },
  {
    _id: 'order-3',
    user: 'demo-user-1',
    items: [
      { _id: '5', name: 'Reusable Shopping Bags', price: 15.99, quantity: 2 },
      { _id: '1', name: 'Eco-Friendly Water Bottle', price: 29.99, quantity: 1 }
    ],
    total: 61.97,
    createdAt: new Date('2024-01-25')
  }
];

console.log('Using in-memory data store for demo purposes');
console.log('Demo user: demo@example.com / demo123');

// Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    products: global.products.length
  });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// 404 handler for API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Products loaded: ${global.products.length}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});