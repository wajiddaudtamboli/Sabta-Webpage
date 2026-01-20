param(
    [switch]$Help
)

if ($Help) {
    Write-Host "Sabta Granite - Setup Verification Script"
    Write-Host "=========================================="
    Write-Host "This script verifies that your development environment is properly set up."
    Write-Host ""
    Write-Host "Usage: .\verify-setup.ps1"
    exit 0
}

Write-Host "🚀 Sabta Granite - Setup Verification Script" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

# Check root dependencies
Write-Host ""
Write-Host "📦 Checking root dependencies..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    npm install
    Write-Host "✅ Root dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ package.json not found in root" -ForegroundColor Red
    exit 1
}

# Check backend
Write-Host ""
Write-Host "🔧 Checking backend..." -ForegroundColor Yellow
if ((Test-Path "backend") -and (Test-Path "backend\package.json")) {
    Set-Location backend
    npm install
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

    if (Test-Path "index.js") {
        Write-Host "✅ Backend entry point exists" -ForegroundColor Green
    } else {
        Write-Host "❌ backend/index.js not found" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    Set-Location ..
} else {
    Write-Host "❌ Backend directory or package.json not found" -ForegroundColor Red
    exit 1
}

# Check frontend
Write-Host ""
Write-Host "🎨 Checking frontend..." -ForegroundColor Yellow
if ((Test-Path "frontend") -and (Test-Path "frontend\package.json")) {
    Set-Location frontend
    npm install
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

    # Try to build
    try {
        npm run build
        Write-Host "✅ Frontend builds successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Frontend build failed" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    Set-Location ..
} else {
    Write-Host "❌ Frontend directory or package.json not found" -ForegroundColor Red
    exit 1
}

# Check environment files
Write-Host ""
Write-Host "🔐 Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Write-Host "✅ .env.example exists" -ForegroundColor Green
} else {
    Write-Host "❌ .env.example not found" -ForegroundColor Red
}

if (Test-Path ".env") {
    Write-Host "⚠️  .env file exists (make sure it's not committed to git)" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  .env file not found (create from .env.example)" -ForegroundColor Blue
}

# Check Vercel configuration
Write-Host ""
Write-Host "☁️  Checking Vercel configuration..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "✅ vercel.json exists" -ForegroundColor Green
} else {
    Write-Host "❌ vercel.json not found" -ForegroundColor Red
}

if (Test-Path "api\index.js") {
    Write-Host "✅ Vercel serverless function exists" -ForegroundColor Green
} else {
    Write-Host "❌ api/index.js not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Setup verification completed!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Copy .env.example to .env and configure your environment variables" -ForegroundColor White
Write-Host "   2. Run 'npm run dev' in backend directory to start the server" -ForegroundColor White
Write-Host "   3. Run 'npm run dev' in frontend directory to start the client" -ForegroundColor White
Write-Host "   4. Visit http://localhost:5173 for the frontend" -ForegroundColor White
Write-Host "   5. Visit http://localhost:5000/api/health for backend health check" -ForegroundColor White