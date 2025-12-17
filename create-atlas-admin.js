const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://wajiddaudtamboli123_db_user:p3NaofPM8RMfM886@cluster0.ljde3yn.mongodb.net/sabta-granite?retryWrites=true&w=majority';

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

async function createAdmin() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
        });
        console.log('Connected to:', mongoose.connection.name);
        
        // Check if admin exists
        const existingAdmin = await AdminUser.findOne({ email: 'admin@sabta.com' });
        if (existingAdmin) {
            console.log('Admin user already exists, deleting and recreating...');
            await AdminUser.deleteOne({ email: 'admin@sabta.com' });
        }
        
        // Create new admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);
        
        const admin = new AdminUser({
            email: 'admin@sabta.com',
            password: hashedPassword,
            role: 'admin'
        });
        
        await admin.save();
        console.log('\n✅ Admin user created successfully in Atlas!');
        console.log('Email: admin@sabta.com');
        console.log('Password: Admin@123');
        
        // Verify
        const verify = await AdminUser.findOne({ email: 'admin@sabta.com' });
        console.log('\nVerification - User in DB:', !!verify);
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
