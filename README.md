# Sabta Granite - Premium Natural Stone Website

A full-stack web application for Sabta Granite, featuring a dynamic frontend, admin panel, and backend API.

## 🚀 Features

- **Dynamic Frontend**: React 19 + Vite with beautiful UI
- **Admin Panel**: Complete CRUD operations for products, blogs, pages, enquiries, and media
- **Backend API**: Node.js + Express 5 with MongoDB
- **Authentication**: JWT-based admin authentication
- **Responsive Design**: Mobile-first approach with Tailwind CSS v4
- **Dark Admin Theme**: Professional dark-themed admin panel

## 📁 Project Structure

```
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/     # Public pages
│   │   ├── admin/     # Admin panel (dark theme)
│   │   ├── components/
│   │   └── api/
├── backend/           # Express backend
│   ├── routes/        # API routes
│   ├── models/        # Mongoose schemas
│   └── middleware/    # Auth middleware
├── api/               # Vercel serverless functions
└── vercel.json        # Vercel deployment config
```

## 🛠️ Local Development

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/wajiddaudtamboli/Sabta-Webpage.git
cd Sabta-Webpage
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Configure Backend Environment**
Create `.env` file in `backend/` folder:
```env
MONGODB_URI=mongodb://localhost:27017/sabta-granite
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

4. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

5. **Create Admin User**
```bash
cd ../backend
node createAdmin.js
```
Default credentials: `admin@sabta.com` / `Admin@123`

6. **Run Development Servers**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## 🚀 Vercel Deployment

### Step 1: Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import from GitHub: `wajiddaudtamboli/Sabta-Webpage`

### Step 2: Configure Environment Variables
In Vercel Project Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/sabta-granite` |
| `JWT_SECRET` | `your_super_secret_jwt_key_32_chars_minimum` |

### Step 3: Deploy
- Click "Deploy"
- Vercel will automatically build and deploy

### Step 4: Create Admin User (Production)
After deployment, you'll need to create an admin user in your MongoDB Atlas database.

Option 1: Use MongoDB Compass to insert directly
Option 2: Use the `/api/auth/register` endpoint once, then remove it

## 🔐 Admin Panel

Access: `https://your-domain.vercel.app/admin/login`

**Default Login** (local):
- Email: `admin@sabta.com`
- Password: `Admin@123`

### Admin Features:
- **Dashboard**: Overview of products, blogs, enquiries
- **Products**: Manage stone products with collections
- **Blogs**: Create/Edit blog posts with SEO
- **Pages**: Edit Home, About, Contact page content
- **Enquiries**: View and manage customer enquiries
- **Media**: Upload and manage images

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:slug` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/blogs` | Get published blogs |
| GET | `/api/blogs/admin` | Get all blogs (admin) |
| POST | `/api/blogs` | Create blog |
| PUT | `/api/blogs/:id` | Update blog |
| DELETE | `/api/blogs/:id` | Delete blog |
| GET | `/api/enquiries` | Get all enquiries |
| POST | `/api/enquiries` | Submit enquiry |
| PUT | `/api/enquiries/:id` | Update enquiry status |
| DELETE | `/api/enquiries/:id` | Delete enquiry |
| GET | `/api/pages/:name` | Get page content |
| PUT | `/api/pages/:name` | Update page content |
| GET | `/api/media` | Get all media |
| POST | `/api/media` | Add media |
| DELETE | `/api/media/:id` | Delete media |

## 🎨 Tech Stack

**Frontend:**
- React 19
- Vite 7
- Tailwind CSS v4
- React Router v7
- Axios
- Framer Motion
- Swiper

**Backend:**
- Node.js
- Express 5
- MongoDB + Mongoose 9
- JWT Authentication
- bcryptjs

**Deployment:**
- Vercel (Serverless Functions)
- MongoDB Atlas

## 📝 MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist IP addresses (use 0.0.0.0/0 for Vercel)
5. Get connection string and add to Vercel environment variables

## 🔧 Troubleshooting

**Build Errors:**
- Ensure all dependencies are installed
- Check for TypeScript/ESLint errors
- Verify environment variables are set

**Database Connection:**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**Authentication Issues:**
- Verify JWT_SECRET is set
- Check token expiration
- Clear localStorage and retry login

## 📄 License

MIT License - feel free to use for personal or commercial projects.
