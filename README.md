# 🚀 CodeLoom

> A comprehensive platform for coding challenges, contests, and skill development with advanced analytics and pattern-based learning.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)


[<video src="https://player.cloudinary.com/embed/?cloud_name=dt3ifipap&public_id=fiybna3tuiairuycmhau" width="100%" controls></video>
](https://player.cloudinary.com/embed/?cloud_name=dt3ifipap&public_id=fiybna3tuiairuycmhau)

[Demo Video](https://drive.google.com/file/d/1Cff5yUO8Jm6ac3IrI3DcKPzEwnUvHUIX/view) • [Report Bug](https://github.com/Tejas-Dherange/LeetCode_PRO/issues) • [Request Feature](https://github.com/Tejas-Dherange/LeetCode_PRO/issues)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Admin Features](#-admin-features)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)

---

## ✨ Features

### 🎯 Core Features
- **Problem Solving Platform**: Extensive collection of coding problems with multiple difficulty levels
- **Real-time Code Execution**: Powered by Judge0 API with support for 70+ programming languages
- **Contest System**: Scalable contests supporting 150-200 concurrent users with live leaderboards
- **Pattern-Based Learning**: Curated problem patterns for structured skill development
- **User Sheets**: Custom problem collections for personalized learning paths

### 📊 Analytics & Monitoring
- **Admin Analytics Dashboard**: Comprehensive user activity tracking and platform statistics
  - User growth metrics (daily, weekly, monthly)
  - Problem-solving statistics with difficulty breakdown
  - Top performers leaderboard
  - Activity timeline charts (7/30/90 days)
  - Subscription distribution analytics
  
- **User Details Modal**: Deep-dive into individual user performance
  - 30-day submission timeline
  - Language preference distribution
  - Difficulty breakdown analysis
  - Pattern progress tracking
  - Recent activity feed
  - Top problem tags

- **CSV Export**: Download analytics data for external analysis
  - User lists with complete statistics
  - Leaderboard data
  - Problem statistics
  - Activity timelines

### 🎨 Advanced Features
- **Live Contest Leaderboards**: Real-time ranking updates via WebSockets
- **Subscription Management**: Multi-tier pricing with Razorpay integration
- **Smart Caching**: Redis-powered caching for optimal performance
- **Queue Management**: BullMQ for handling high-volume submissions
- **Code Plagiarism Detection**: Contest integrity features
- **Responsive UI**: Beautiful, mobile-friendly interface with dark/light themes

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Cache**: Redis
- **Queue**: BullMQ
- **Authentication**: JWT + Google OAuth
- **Payment**: Razorpay
- **Code Execution**: Judge0 API
- **AI Integration**: Google Gemini API
- **File Storage**: Cloudinary

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS + DaisyUI
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time**: WebSockets

### DevOps
- **Containerization**: Docker
- **Database Migrations**: Prisma Migrate
- **Environment**: dotenv

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16.0.0
- PostgreSQL database (or Neon account)
- Redis server
- Judge0 instance (self-hosted or RapidAPI)
- Razorpay account (for payments)
- Google Cloud Console project (for OAuth)
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Tejas-Dherange/LeetCode_PRO.git
cd LeetCode_PRO
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Set up environment variables**

Create `.env` in the `backend` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/codeloom"

# Authentication
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Judge0 API
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_BATCH_SUBMISSION_ENDPOINT=https://judge0-ce.p.rapidapi.com/submissions/batch
JUDGE0_API_KEY=your_rapidapi_key
JUDGE0_HOST=judge0-ce.p.rapidapi.com

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

Create `.env` in the `frontend` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:4000
```

4. **Set up the database**

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

5. **Start the development servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

---

## 🏗 Architecture

### System Overview

```mermaid
graph TB
    Client[React Frontend] --> API[Express API Server]
    API --> DB[(PostgreSQL)]
    API --> Redis[(Redis Cache)]
    API --> Judge0[Judge0 API]
    API --> Queue[BullMQ Queue]
    Queue --> Workers[Background Workers]
    API --> Razorpay[Razorpay Gateway]
    API --> Cloudinary[Cloudinary]
    Client <--> WS[WebSocket Server]
```

### Key Components

- **Authentication Layer**: JWT-based auth with Google OAuth integration
- **Contest Engine**: WebSocket-powered real-time contest system with Redis caching
- **Submission Queue**: BullMQ handles code execution requests asynchronously
- **Analytics Engine**: Real-time data aggregation with Prisma queries
- **Payment System**: Razorpay webhook integration for subscription management

---

## 👨‍💼 Admin Features

Access admin features by logging in with an admin account at `/admin/*`

### Admin Dashboard (`/admin/monitoring`)
- System health monitoring
- Queue metrics and status
- Judge0 API health checks
- Redis cache statistics
- Submission analytics by time period
- Real-time metrics with auto-refresh

### User Analytics (`/admin/analytics`)
- **User Growth**: Track total, active, and new user signups
- **Problem Statistics**: Platform-wide solving metrics
- **Leaderboards**: Top performers by problems solved
- **Activity Timelines**: Visual trends over customizable periods
- **Searchable User Management**: Find and view detailed user profiles
- **CSV Exports**: Download data for reporting

### Pattern Management (`/admin/patterns`)
- Create and manage learning patterns
- Add problems to patterns
- Track pattern completion rates

### Problem Management (`/add-problem`)
- Add new coding problems
- Set difficulty levels and tags
- Configure test cases
- Upload problem statements

### Contest Management (`/dashboard/contest/create-contest`)
- Create timed contests
- Add problems to contests
- Set registration deadlines
- Monitor live participation

---

## 📡 API Documentation

### Authentication Endpoints
```
POST   /api/v1/auth/google           - Google OAuth login
GET    /api/v1/auth/me               - Get current user
POST   /api/v1/auth/logout           - Logout user
```

### Problem Endpoints
```
GET    /api/v1/problems              - Get all problems
GET    /api/v1/problems/:id          - Get problem by ID
POST   /api/v1/problems              - Create problem (Admin)
PUT    /api/v1/problems/:id          - Update problem (Admin)
DELETE /api/v1/problems/:id          - Delete problem (Admin)
```

### Submission Endpoints
```
POST   /api/v1/submissions           - Submit code
GET    /api/v1/submissions/:id       - Get submission status
GET    /api/v1/submissions/user/:id  - Get user submissions
```

### Contest Endpoints
```
GET    /api/v1/contests              - List all contests
POST   /api/v1/contests              - Create contest (Admin)
GET    /api/v1/contests/:id          - Get contest details
POST   /api/v1/contests/:id/register - Register for contest
GET    /api/v1/contests/:id/leaderboard - Get live leaderboard
```

### Admin Analytics Endpoints
```
GET    /api/v1/admin/monitoring/users/analytics    - User statistics
GET    /api/v1/admin/monitoring/problems/stats     - Problem statistics
GET    /api/v1/admin/monitoring/users/top          - Top users leaderboard
GET    /api/v1/admin/monitoring/users              - Paginated user list
GET    /api/v1/admin/monitoring/users/:id/details  - Detailed user profile
GET    /api/v1/admin/monitoring/activity           - Activity timeline
```

---

## 🗄 Database Schema

### Core Models
- **User**: User profiles, authentication, roles
- **Problem**: Coding problems with metadata
- **Submission**: Code submissions and results
- **ProblemSolved**: User-problem solving history
- **Contest**: Contest configurations
- **ContestRegistration**: User contest participation
- **Pattern**: Learning pattern definitions
- **PatternProgress**: User pattern completion tracking
- **Subscription**: User subscription plans
- **Sheet**: Custom problem collections

### Relationships
- User → Submissions (1:N)
- User → ProblemsSolved (N:M via ProblemSolved)
- Contest → Problems (N:M via ContestProblem)
- Pattern → Problems (N:M via PatternProblem)
- User → Patterns (N:M via PatternProgress)

---

## 🎓 Usage Examples

### Running a Contest
1. Admin creates contest at `/dashboard/contest/create-contest`
2. Users register before deadline
3. Contest starts - live leaderboard updates via WebSocket
4. Submissions processed through BullMQ queue
5. Real-time ranking updates as users solve problems

### Tracking User Analytics
1. Navigate to `/admin/analytics`
2. View overall platform metrics
3. Click "View" on any user to see detailed profile modal
4. Export data to CSV for external analysis
5. Toggle auto-refresh for real-time monitoring

### Creating Learning Patterns
1. Go to `/admin/patterns`
2. Create new pattern (e.g., "Two Pointers")
3. Add relevant problems to the pattern
4. Users can track progress on `/patterns/:slug`

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 🚢 Deployment

### Using Docker
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment
1. Set production environment variables
2. Build frontend: `cd frontend && npm run build`
3. Run Prisma migrations: `cd backend && npx prisma migrate deploy`
4. Start backend: `cd backend && npm start`
5. Serve frontend build with nginx or similar

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Tejas Dherange**
- GitHub: [@Tejas-Dherange](https://github.com/Tejas-Dherange)

---

## 🙏 Acknowledgments

- [Judge0](https://judge0.com/) for code execution API
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Razorpay](https://razorpay.com/) for payment processing
- [Google OAuth](https://developers.google.com/identity) for authentication
- [Cloudinary](https://cloudinary.com/) for media management

---

## 📞 Support

For support, email your-email@example.com or join our Discord server.

---

<div align="center">
Made with ❤️ by Tejas Dherange
</div>
