const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://wajiddaudtamboli123_db_user:p3NaofPM8RMfM886@cluster0.ljde3yn.mongodb.net/sabta-granite?retryWrites=true&w=majority';

console.log('Testing MongoDB Atlas Connection...');
console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
})
.then(() => {
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    return mongoose.connection.close();
})
.then(() => {
    console.log('Connection closed.');
    process.exit(0);
})
.catch((err) => {
    console.error('❌ FAILED to connect:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    if (err.reason) {
        console.error('Reason:', err.reason);
    }
    process.exit(1);
});
