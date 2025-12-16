# Sabta Granite - Premium Natural Stone Website

A full-stack web application for Sabta Granite, featuring a dynamic frontend, admin panel, and backend API.

## 🚀 Features

- **Dynamic Frontend**: React + Vite with beautiful UI
- **Admin Panel**: Complete CRUD operations for products, blogs, pages, and media
- **Backend API**: Node.js + Express with MongoDB
- **Authentication**: JWT-based admin authentication
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 📁 Project Structure

```
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/     # Public pages
│   │   ├── admin/     # Admin panel
│   │   ├── components/
│   │   └── api/
├── backend/           # Express backend
│   ├── routes/        # API routes
│   └── middleware/    # Auth middleware
├── database/          # Mongoose schemas
└── vercel.json        # Vercel deployment config
```

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

5. **Run the Application**

**Backend** (in `backend/` directory):
```bash
npm start
```

**Frontend** (in `frontend/` directory):
```bash
npm run dev
```

Visit `http://localhost:5173` for the frontend and `http://localhost:5000` for the backend API.

## 🚀 Deployment on Vercel

### Environment Variables Required:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secure random string for JWT
- `VITE_BACKEND_URL` - Set to `/api`

### Steps:
1. Import repository to Vercel
2. Add environment variables
3. Deploy

## 🔐 Admin Panel

Access the admin panel at `/admin/login`

**Create First Admin User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"YourPassword123"}'
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (auth required)
- `PUT /api/blogs/:id` - Update blog (auth required)
- `DELETE /api/blogs/:id` - Delete blog (auth required)

### Pages
- `GET /api/pages/:pageName` - Get page content
- `PUT /api/pages/:pageName` - Update page content (auth required)

### Enquiries
- `POST /api/enquiries` - Submit enquiry
- `GET /api/enquiries` - Get all enquiries (auth required)

### Media
- `GET /api/media` - Get all media
- `POST /api/media` - Upload media (auth required)

## 🛡️ Security

- JWT authentication for admin routes
- Password hashing with bcrypt
- CORS enabled
- Environment variables for sensitive data

## 📄 License

This project is proprietary and confidential.

## 👥 Contact

For support or inquiries, please contact Sabta Granite.
