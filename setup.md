How to install dependencies
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

# Judge0 local setup
Install Docker and Docker Compose.
Download and extract the release archive:
```bash
wget https://github.com/judge0/judge0/releases/download/v1.13.0/judge0-v1.13.0.zip
unzip judge0-v1.13.0.zip

```
Run all services and wait a few seconds until everything is initialized:
```bash
cd judge0-v1.13.0
docker-compose up -d db redis
sleep 10s
docker-compose up -d
sleep 5s
```
Your instance of Judge0 CE v1.13.0 is now available at http://< IP ADDRESS OF YOUR SERVER >:2358.

# Database setup
1. Install PostgreSQL and create a database named `codeloom`.
2. Run the following command to set up the database schema:
```bash
npx prisma migrate dev --name init
```
