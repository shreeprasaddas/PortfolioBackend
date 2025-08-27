# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

## Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"

## Step 3: Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

## Step 4: Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add only your server's IP address
5. Click "Confirm"

## Step 5: Get Your Connection String
1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

## Step 6: Create .env File
Create a `.env` file in your PortfolioBackend directory with:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# Example:
# MONGODB_URI=mongodb+srv://shreeprasad:yourpassword123@cluster0.abc123.mongodb.net/portfolio?retryWrites=true&w=majority

# Admin Authentication
ADMIN_SECRET_KEY=shree

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads
```

## Step 7: Update Connection String
Replace the placeholders in your MONGODB_URI:
- `<username>`: Your database username
- `<password>`: Your database password
- `<cluster-url>`: Your cluster URL
- `<database-name>`: Your database name (e.g., "portfolio")

## Step 8: Test Connection
1. Start your backend server
2. Check the console for connection success messages
3. You should see: "✅ MongoDB Atlas connected successfully!"

## Troubleshooting
- **Connection failed**: Check username, password, and IP whitelist
- **Authentication failed**: Verify username and password
- **Network timeout**: Check if your IP is whitelisted
- **SSL issues**: Make sure you're using `mongodb+srv://` protocol

## Security Notes
- Never commit your `.env` file to version control
- Use strong passwords for database users
- Restrict IP access in production
- Regularly rotate database passwords
