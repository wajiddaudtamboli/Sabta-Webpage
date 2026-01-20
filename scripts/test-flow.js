// Test script to verify the complete flow: Admin -> DB -> Frontend
const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

const Collection = require('../backend/models/Collection');
const Product = require('../backend/models/Product');

async function testFlow() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 60000,
        });
        console.log('✅ Connected to MongoDB');

        // 1. Check existing collections
        console.log('\n📚 Checking existing collections...');
        let collections = await Collection.find({ status: 'active' });
        console.log(`Found ${collections.length} active collections`);

        if (collections.length === 0) {
            console.log('⚠️ No collections found, creating test collection...');
            const testCollection = new Collection({
                name: 'Test Marble Series',
                description: 'Test collection for verification',
                status: 'active',
                displayOrder: 100
            });
            await testCollection.save();
            console.log('✅ Test collection created:', testCollection.name, 'Slug:', testCollection.slug);
            collections = [testCollection];
        }

        // 2. Check products for first collection
        const firstCollection = collections[0];
        console.log(`\n🔍 Checking products for collection: ${firstCollection.name}`);
        
        const products = await Product.find({
            $or: [
                { collectionId: firstCollection._id },
                { category: { $regex: new RegExp(firstCollection.name.replace(' Series', ''), 'i') } }
            ]
        });
        console.log(`Found ${products.length} products`);

        if (products.length === 0) {
            console.log('⚠️ No products found, creating test product...');
            const testProduct = new Product({
                name: 'Test White Marble',
                category: firstCollection.name.replace(' Series', ''),
                collectionId: firstCollection._id,
                collectionName: firstCollection.name,
                description: 'Beautiful white marble for testing',
                color: 'White',
                finish: 'Polished',
                origin: 'Italy',
                status: 'active',
                isNatural: true,
                primaryImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
            });
            await testProduct.save();
            console.log('✅ Test product created:', testProduct.name, 'Slug:', testProduct.slug);
        }

        // 3. Verify the flow
        console.log('\n📊 Verification Summary:');
        console.log('------------------------');
        
        const allCollections = await Collection.find({ status: 'active' }).sort({ displayOrder: 1 });
        for (const col of allCollections) {
            const prodCount = await Product.countDocuments({
                $or: [
                    { collectionId: col._id },
                    { category: { $regex: new RegExp(col.name.replace(' Series', '').replace(' Collections', ''), 'i') } }
                ],
                status: 'active'
            });
            console.log(`  ${col.name} (slug: ${col.slug}): ${prodCount} products`);
        }

        console.log('\n✅ Flow test completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Open http://localhost:5173/collections to see collections');
        console.log('2. Click on a collection to see its products');
        console.log('3. Open http://localhost:5173/admin to add more data');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

testFlow();
