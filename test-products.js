const mongoose = require('mongoose');
const Product = require('./backend/models/Product');
const uri = 'mongodb+srv://sabta_admin:Sabta123@cluster0.ljde3yn.mongodb.net/sabta-granite?retryWrites=true&w=majority';

console.log('Testing product count...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    const count = await Product.countDocuments();
    console.log('Total products in database:', count);

    const products = await Product.find({}).limit(3);
    console.log('Sample products:');
    products.forEach((p, i) => {
      console.log((i+1) + '. ' + p.name + ' - Status: ' + p.status);
    });

    return mongoose.connection.close();
  })
  .catch(err => {
    console.log('Error:', err.message);
  });