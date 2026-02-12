// Setup Script - Create Demo Admin and Products using MongoDB
// Run once: node setup.js
const bcrypt = require('bcryptjs');
const connectDB = require('./config/mongodb');
const Admin = require('./models/Admin');
const Product = require('./models/Product');

async function setupDatabase() {
  try {
    await connectDB();
    console.log('🔄 Setting up database...\n');

    // Create demo admin
    console.log('1️⃣ Creating demo admin...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123', salt);

    const existing = await Admin.findOne({ email: 'admin@gnsons.com' });
    if (!existing) {
      await Admin.create({ email: 'admin@gnsons.com', name: 'Admin User', passwordHash, permissions: ['all'] });
      console.log('✅ Demo admin created!');
      console.log('   Email: admin@gnsons.com');
      console.log('   Password: Admin@123\n');
    } else {
      console.log('ℹ️ Demo admin already exists');
    }

    // Create sample products
    console.log('2️⃣ Creating sample products...');

    const sampleProducts = [
      { name: 'Premium Leather Watch', category: 'Watches', price: 4500, originalPrice: 6000, description: 'High-quality leather strap watch with classic design', stock: 25, isFeatured: true },
      { name: 'Wireless Headphones', category: 'Electronics', price: 3500, originalPrice: 5000, description: 'Noise-cancelling wireless headphones with 20-hour battery', stock: 50, isFeatured: true },
      { name: 'Designer Sunglasses', category: 'Accessories', price: 2500, originalPrice: 4000, description: 'Premium UV protection sunglasses with trendy design', stock: 40 },
      { name: 'Luxury Perfume', category: 'Beauty', price: 3000, originalPrice: 4500, description: 'Original imported perfume with long-lasting fragrance', stock: 60, isFeatured: true },
      { name: 'Smartphone Case', category: 'Electronics', price: 800, originalPrice: 1200, description: 'Premium protective case with shock absorption', stock: 150 }
    ];

    for (const p of sampleProducts) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) await Product.create(p);
    }

    console.log(`✅ ${sampleProducts.length} sample products ensured!\n`);
    console.log('🎉 Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
