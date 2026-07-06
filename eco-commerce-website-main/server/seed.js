const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Sample products data
const sampleProducts = [
  {
    name: "Eco-Friendly Water Bottle",
    description: "Reusable stainless steel water bottle that keeps drinks cold for 24 hours and hot for 12 hours.",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    price: 29.99,
    tags: ["eco-friendly", "reusable", "stainless steel"],
    isEcoFriendly: true
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Soft, comfortable t-shirt made from 100% organic cotton. Available in multiple colors.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    price: 24.99,
    tags: ["organic", "cotton", "clothing"],
    isEcoFriendly: true
  },
  {
    name: "Bamboo Phone Case",
    description: "Protective phone case made from sustainable bamboo. Compatible with most phone models.",
    imageUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
    price: 19.99,
    tags: ["bamboo", "phone case", "sustainable"],
    isEcoFriendly: true
  },
  {
    name: "Solar Power Bank",
    description: "Portable solar-powered charger for your devices. Perfect for outdoor adventures.",
    imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    price: 49.99,
    tags: ["solar", "power bank", "portable"],
    isEcoFriendly: true
  },
  {
    name: "Recycled Notebook",
    description: "High-quality notebook made from 100% recycled paper. Perfect for journaling or note-taking.",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    price: 12.99,
    tags: ["recycled", "notebook", "paper"],
    isEcoFriendly: true
  },
  {
    name: "LED Desk Lamp",
    description: "Energy-efficient LED desk lamp with adjustable brightness and color temperature.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    price: 39.99,
    tags: ["LED", "desk lamp", "energy efficient"],
    isEcoFriendly: false
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products added successfully');

    // Close connection
    await mongoose.connection.close();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
