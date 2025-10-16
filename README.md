# Codeloom
A platform for coding challenges and competitions.


## Installation instructions
1. Clone the repository
```bash
git clone https://github.com/Tejas-Dherange/LeetCode_PRO.git
cd LeetCode_PRO
```

2. Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install

```
3. Create a `.env` file in the root directory and add the following environment variables:
```env
PORT=3000
JWT_SECRET=

JUDGE0_BATCH_SUBMISSION_ENDPOINT=
JUDGE0_BATCH_SUBMISSION_ENDPOINT=
JUDGE0_SULU_API_KEY=
GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5173
```

# Usage examples
4. Start the server
```bash
cd frontend
npm run dev

cd ../backend
npm run dev

```

5. Open your browser and navigate to `http://localhost:3000` to access the application.

# Screenshots or demos (if visual)
![Landing Page](<Screenshot (268).png>)
[Demo Video](https://drive.google.com/file/d/1Cff5yUO8Jm6ac3IrI3DcKPzEwnUvHUIX/view)
 
# Technology stack
- Node.js
- Express.js
- Prisma
- PostgreSQL
- React.js
- Tailwind CSS
- Judge0 API
- Cloudinary
- Razorpay
- Gemini API
- JWT Authentication
- WebSockets
- Redis
- Docker
- Zustand


## Steps to initialize prisma in project
```
1] npm i prisma 
2] npm i @prisma/client
3] npx prisma init
```

```


2) npx prisma generate
3) npx prisma migrate dev
4) npx prisma db push
```




JUDGE0_API_URL=http://localhost:2358/

### TODO :-

## FREE plan Subscription handling is remaining

5. Database Migration Commands
# Generate migration
npx prisma migrate dev --name add_subscription_models

# Generate client
npx prisma generate


6. Environment Variables

# Next todo
## Sheets and Problems
 - add frontend for sheets creation and problem adding ✅
 - Display the saved sheets and problems in the frontend ✅
 - Add functionality to delete sheets and problems ✅
 - Add functionality to edit sheets and problems ✅
 - Add functionality to add problems to sheets 


# Next todo
  ## Contest
  - Make constest handling for 150-200 users
  - Use redis bullMq for contest handling
  - Web Sockets for live Leaderboard
  - Add verification of users for contest
  - Reduce copy paste of code in contest - dont allow copy paste and tab switching
  - Add timer for contest
  - Generate report fo contest

# Next todo
  ## Drag-race coding
  - Two user can compete with each other on one problem
  - Implement real-time collaboration features
    - Add timer
    - Add live coding features
    - Add live chat features
    - Add live code sharing features
    - Add live code execution features
    - Add live code submission features
