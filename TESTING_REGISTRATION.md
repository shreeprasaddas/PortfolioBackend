# Testing Admin Registration with Environment Variables

## 🔧 Setup Instructions

### 1. Create Environment File
Create a `.env` file in the `PortfolioBackend` directory:

```bash
# PortfolioBackend/.env
MONGODB_URI=mongodb://localhost:27017/portfolio
ADMIN_SECRET_KEY=YOUR_CUSTOM_SECRET_KEY_HERE
PORT=5000
NODE_ENV=development
```

### 2. Set Your Custom Secret Key
Replace `YOUR_CUSTOM_SECRET_KEY_HERE` with your actual secret key, for example:
```bash
ADMIN_SECRET_KEY=MyPortfolioAdmin2024!@#
```

### 3. Restart Backend Server
After creating/updating the .env file, restart your backend server:
```bash
cd PortfolioBackend
npm start
```

## 🧪 Testing Steps

### Step 1: Check Environment Loading
Visit: `http://localhost:5000/debug/env`

You should see:
```json
{
  "ADMIN_SECRET_KEY_SET": true,
  "NODE_ENV": "development",
  "PORT": "5000"
}
```

If `ADMIN_SECRET_KEY_SET` is `false`, your environment file is not being loaded correctly.

### Step 2: Test Registration
1. Go to: `http://localhost:3000/admin/register`
2. Fill out the form:
   - Email: `test@admin.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Secret Key: Use the EXACT same value you set in your `.env` file

### Step 3: Check Backend Logs
Watch the backend console for debug messages:
```
=== Registration Route Hit ===
Request body: { email: 'test@admin.com', password: 'password123', secretKey: 'MyPortfolioAdmin2024!@#' }
Environment ADMIN_SECRET_KEY exists: true
Attempting registration with secret key...
Expected secret key from env: MyPortfolioAdmin2024!@#
Provided secret key: MyPortfolioAdmin2024!@#
Secret key validated successfully
```

## ✅ Expected Results

### Successful Registration:
- Frontend shows green success message
- Backend logs show secret key validation success
- User is redirected to login page after 2 seconds
- Can login with new credentials

### Failed Registration (Wrong Secret Key):
- Frontend shows error: "Invalid secret key. Contact system administrator."
- Backend logs show secret key mismatch
- No account is created

## 🐛 Troubleshooting

### Environment Variables Not Loading:
1. Ensure `.env` file is in `PortfolioBackend` directory (not root)
2. Check file encoding (should be UTF-8)
3. No quotes around values in .env file
4. Restart backend server after changes

### Secret Key Still Not Working:
1. Check backend console logs for exact values
2. Ensure no extra spaces in secret key
3. Case-sensitive comparison
4. Check if .env file has correct variable name: `ADMIN_SECRET_KEY`

### Database Connection Issues:
1. Ensure MongoDB is running
2. Check MONGODB_URI in .env file
3. Verify database connection in backend logs

## 🔒 Security Notes

### For Development:
- Use simple but secure secret keys
- Keep .env file out of version control (add to .gitignore)

### For Production:
- Use strong, random secret keys (32+ characters)
- Store in secure environment variable management
- Rotate keys periodically
- Monitor access logs

## 📝 Default Fallback

If no environment variable is set, the system falls back to:
```
ADMIN_SECRET_KEY = "PORTFOLIO_ADMIN_2024"
```

But it's recommended to always set your own custom secret key.
