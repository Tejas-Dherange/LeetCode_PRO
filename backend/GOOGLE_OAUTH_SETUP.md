# Google OAuth Environment Variables

Add these to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/user/google/callback

# Client redirect URL (for production use your actual frontend URL)
CLIENT_HOME_URL=http://localhost:5173/dashboard
```

## How to Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen
6. Set Authorized redirect URIs:
   - Development: `http://localhost:3000/api/v1/user/google/callback`
   - Production: `https://your-api-domain.com/api/v1/user/google/callback`
7. Copy **Client ID** and **Client Secret**

## Database Migration

After updating the schema, run:

```bash
# Generate Prisma client with new fields
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_oauth_support

# Or if you want to just push changes without migration
npx prisma db push
```

## Install Required Packages

```bash
npm install passport passport-google-oauth20
```

## API Endpoints

### Google OAuth Flow
- **Initiate Google Login**: `GET /api/v1/user/google`
- **Callback**: `GET /api/v1/user/google/callback` (handled by Google)

### Password Management
- **Set Password** (for OAuth users): `POST /api/v1/user/set-password`
  ```json
  {
    "newPassword": "newSecurePassword123"
  }
  ```

### Regular Login (Updated)
- **Login**: `POST /api/v1/user/login`
  - If user has no password (OAuth only), returns:
    ```json
    {
      "oauthOnly": true,
      "message": "Account created with Google. Use Google login or set a password."
    }
    ```

## Frontend Integration Example

```javascript
// Google Login Button
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:3000/api/v1/user/google';
};

// Set Password for OAuth users
const setPassword = async (newPassword) => {
  const response = await axiosInstance.post('/user/set-password', {
    newPassword
  });
  return response.data;
};
```

## Security Notes

1. **CORS**: Update your CORS origin in production to only allow your frontend domain
2. **Secure Cookies**: Cookies are automatically secure in production (NODE_ENV=production)
3. **Environment Variables**: Never commit `.env` file to version control
4. **Session**: Using JWT with cookies, not Express sessions
