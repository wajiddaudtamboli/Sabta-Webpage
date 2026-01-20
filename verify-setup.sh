#!/bin/bash

echo "🚀 Sabta Granite - Setup Verification Script"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Check root dependencies
echo ""
echo "📦 Checking root dependencies..."
if [ -f "package.json" ]; then
    npm install
    echo "✅ Root dependencies installed"
else
    echo "❌ package.json not found in root"
    exit 1
fi

# Check backend
echo ""
echo "🔧 Checking backend..."
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    cd backend
    npm install
    echo "✅ Backend dependencies installed"
    # Check if index.js exists
    if [ -f "index.js" ]; then
        echo "✅ Backend entry point exists"
    else
        echo "❌ backend/index.js not found"
        exit 1
    fi
    cd ..
else
    echo "❌ Backend directory or package.json not found"
    exit 1
fi

# Check frontend
echo ""
echo "🎨 Checking frontend..."
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    cd frontend
    npm install
    echo "✅ Frontend dependencies installed"
    # Try to build
    if npm run build; then
        echo "✅ Frontend builds successfully"
    else
        echo "❌ Frontend build failed"
        exit 1
    fi
    cd ..
else
    echo "❌ Frontend directory or package.json not found"
    exit 1
fi

# Check environment files
echo ""
echo "🔐 Checking environment configuration..."
if [ -f ".env.example" ]; then
    echo "✅ .env.example exists"
else
    echo "❌ .env.example not found"
fi

if [ -f ".env" ]; then
    echo "⚠️  .env file exists (make sure it's not committed to git)"
else
    echo "ℹ️  .env file not found (create from .env.example)"
fi

# Check Vercel configuration
echo ""
echo "☁️  Checking Vercel configuration..."
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json exists"
else
    echo "❌ vercel.json not found"
fi

if [ -f "api/index.js" ]; then
    echo "✅ Vercel serverless function exists"
else
    echo "❌ api/index.js not found"
fi

echo ""
echo "🎉 Setup verification completed!"
echo "📋 Next steps:"
echo "   1. Copy .env.example to .env and configure your environment variables"
echo "   2. Run 'npm run dev' in backend directory to start the server"
echo "   3. Run 'npm run dev' in frontend directory to start the client"
echo "   4. Visit http://localhost:5173 for the frontend"
echo "   5. Visit http://localhost:5000/api/health for backend health check"