import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const productTemplates = [
  {
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with 40hr battery, active noise cancellation, and studio-quality sound.',
    price: 249.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    stock: 45,
    rating: 4.8,
    numReviews: 128,
  },
  {
    title: 'Smart Watch Pro',
    description: 'Fitness tracking, heart rate monitor, GPS, and seamless smartphone integration.',
    price: 399.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    stock: 30,
    rating: 4.6,
    numReviews: 89,
  },
  {
    title: 'Minimalist Leather Backpack',
    description: 'Handcrafted genuine leather backpack with laptop compartment and water-resistant lining.',
    price: 129.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    stock: 60,
    rating: 4.7,
    numReviews: 56,
  },
  {
    title: 'Running Shoes Ultra',
    description: 'Lightweight breathable mesh with responsive cushioning for marathon performance.',
    price: 159.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    stock: 80,
    rating: 4.5,
    numReviews: 203,
  },
  {
    title: 'Organic Skincare Set',
    description: 'Five-piece natural skincare collection with vitamin C serum, moisturizer, and cleanser.',
    price: 79.99,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
    stock: 100,
    rating: 4.9,
    numReviews: 312,
  },
  {
    title: 'Ergonomic Office Chair',
    description: 'Adjustable lumbar support, breathable mesh back, and 360° swivel for all-day comfort.',
    price: 349.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1580480051963-fff9e554d5f3?w=600',
    stock: 25,
    rating: 4.4,
    numReviews: 67,
  },
  {
    title: 'Mechanical Keyboard RGB',
    description: 'Cherry MX switches, per-key RGB lighting, and aluminum frame for gamers and professionals.',
    price: 149.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511467687850-3d100c0d0e38?w=600',
    stock: 55,
    rating: 4.7,
    numReviews: 145,
  },
  {
    title: 'Stainless Steel Water Bottle',
    description: '32oz insulated bottle keeps drinks cold 24hrs or hot 12hrs. BPA-free and leak-proof.',
    price: 34.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    stock: 200,
    rating: 4.6,
    numReviews: 421,
  },
  {
    title: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs with modern matte finish. Dishwasher safe.',
    price: 44.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    stock: 75,
    rating: 4.3,
    numReviews: 38,
  },
  {
    title: 'Denim Jacket Classic',
    description: 'Timeless medium-wash denim jacket with button closure and multiple pockets.',
    price: 89.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600',
    stock: 40,
    rating: 4.5,
    numReviews: 92,
  },
  {
    title: 'Portable Bluetooth Speaker',
    description: '360° sound, IPX7 waterproof, 20-hour playtime. Perfect for outdoor adventures.',
    price: 69.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    stock: 90,
    rating: 4.4,
    numReviews: 178,
  },
  {
    title: 'Yoga Mat Premium',
    description: 'Extra thick 6mm non-slip mat with carrying strap. Eco-friendly TPE material.',
    price: 49.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
    stock: 120,
    rating: 4.8,
    numReviews: 256,
  },
];

// Function to generate random products
const generateRandomProducts = (count = 20) => {
  const adjectives = ['Premium', 'Luxury', 'Professional', 'Advanced', 'Smart', 'Eco-Friendly', 'Durable', 'Lightweight', 'Compact', 'Ultra', 'Crystal', 'Sleek', 'Elegant', 'Robust', 'Turbo', 'Ultra-Fast', 'Supreme', 'Quantum', 'Zen', 'Royal'];
  const nouns = ['Backpack', 'Headphones', 'Watch', 'Shoes', 'Jacket', 'Bag', 'Tablet', 'Monitor', 'Lamp', 'Desk', 'Stand', 'Charger', 'Case', 'Cable', 'Lens', 'Tripod', 'Microphone', 'Amplifier', 'Dock', 'Cradle'];
  const categories = ['Electronics', 'Fashion', 'Sports', 'Beauty', 'Home', 'Gaming', 'Photography', 'Audio'];
  const images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
  ];

  const randomProducts = [];
  for (let i = 0; i < count; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const price = parseFloat((Math.random() * 400 + 20).toFixed(2));
    const stock = Math.floor(Math.random() * 200 + 10);
    const rating = parseFloat((Math.random() * 0.5 + 4.2).toFixed(1));
    const numReviews = Math.floor(Math.random() * 500 + 10);

    randomProducts.push({
      title: `${adj} ${noun}`,
      description: `High-quality ${noun.toLowerCase()} with premium features and excellent performance. Perfect for everyday use and special occasions.`,
      price,
      category: categories[Math.floor(Math.random() * categories.length)],
      image: images[Math.floor(Math.random() * images.length)],
      stock,
      rating,
      numReviews,
    });
  }
  return randomProducts;
};

const products = [...productTemplates, ...generateRandomProducts(20)];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany();
    await User.deleteMany({ email: { $in: ['admin@semes.com', 'user@semes.com'] } });

    await Product.insertMany(products);
    console.log(`${products.length} products seeded`);

    await User.create({
      name: 'Admin User',
      email: 'admin@semes.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'Demo User',
      email: 'user@semes.com',
      password: 'user123',
      role: 'user',
    });

    console.log('Users seeded:');
    console.log('  Admin: admin@semes.com / admin123');
    console.log('  User:  user@semes.com / user123');
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
