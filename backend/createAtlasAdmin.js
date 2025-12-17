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
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
        console.log('Connected to:', mongoose.connection.name);
        
        const existingAdmin = await AdminUser.findOne({ email: 'admin@sabta.com' });
        if (existingAdmin) {
            console.log('Admin already exists, deleting...');
            await AdminUser.deleteOne({ email: 'admin@sabta.com' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);
        
        const admin = new AdminUser({
            email: 'admin@sabta.com',
            password: hashedPassword,
            role: 'admin'
        });
        
        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@sabta.com');
        console.log('Password: Admin@123');
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
