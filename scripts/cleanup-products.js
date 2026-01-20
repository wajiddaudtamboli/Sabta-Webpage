// Script to remove inactive products SG00001 and SG00002
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sabta_admin:Sabta123@cluster0.ljde3yn.mongodb.net/sabta-granite';

async function cleanup() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB');

        // Get the Product collection directly
        const Product = mongoose.connection.collection('products');
        
        // Find products with codes SG00001 and SG00002
        const productsToDelete = await Product.find({
            $or: [
                { code: 'SG00001' },
                { code: 'SG00002' },
                { status: 'inactive' }
            ]
        }).toArray();
        
        console.log('Products to delete:', productsToDelete.length);
        productsToDelete.forEach(p => {
            console.log(`  - ${p.code || 'no code'}: ${p.name} (status: ${p.status})`);
        });
        
        if (productsToDelete.length > 0) {
            // Delete the products
            const result = await Product.deleteMany({
                $or: [
                    { code: 'SG00001' },
                    { code: 'SG00002' },
                    { status: 'inactive' }
                ]
            });
            console.log(`Deleted ${result.deletedCount} product(s)`);
        } else {
            console.log('No products found matching criteria');
        }
        
        // Show remaining products count
        const remainingCount = await Product.countDocuments({});
        console.log(`Remaining products in database: ${remainingCount}`);
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

cleanup();
