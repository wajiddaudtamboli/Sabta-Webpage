const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Check products
        const products = await mongoose.connection.db.collection('products').find({}).limit(10).toArray();
        console.log('\n=== PRODUCTS ===');
        console.log('Total products in DB:', products.length);
        products.forEach(p => console.log('  -', p.name || p.code, '| Category:', p.category));
        
        // Check collections
        const collections = await mongoose.connection.db.collection('collections').find({}).toArray();
        console.log('\n=== COLLECTIONS ===');
        console.log('Total collections in DB:', collections.length);
        collections.forEach(c => console.log('  -', c.name, '| Status:', c.status));
        
        // Check admin users
        const users = await mongoose.connection.db.collection('adminusers').find({}).toArray();
        console.log('\n=== ADMIN USERS ===');
        console.log('Total admin users:', users.length);
        users.forEach(u => console.log('  - Email:', u.email, '| Role:', u.role));
        
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkDB();
