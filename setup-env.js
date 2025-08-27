import fs from 'fs';
import path from 'path';

console.log('🔧 Setting up MongoDB Atlas environment...');

// Your MongoDB Atlas credentials
const envContent = `# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://Shree:cQeunHQ5HNWZhjCf@cluster0.sgc54jj.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0

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
`;

const envPath = path.join(process.cwd(), '.env');

try {
    // Check if .env already exists
    if (fs.existsSync(envPath)) {
        console.log('⚠️  .env file already exists. Backing up as .env.backup');
        fs.copyFileSync(envPath, envPath + '.backup');
    }
    
    // Create new .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📋 Environment variables set:');
    console.log('   - MONGODB_URI: ✅ Set (with portfolio database)');
    console.log('   - ADMIN_SECRET_KEY: ✅ Set');
    console.log('   - PORT: ✅ Set to 5000');
    console.log('   - NODE_ENV: ✅ Set to development');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Test MongoDB Atlas connection: npm run test:db');
    console.log('2. Start backend server: npm start');
    console.log('3. Start frontend: cd ../PortfolioFrontend_react && npm start');
    
} catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    console.log('\n💡 Manual setup required:');
    console.log('Create a .env file in PortfolioBackend directory with:');
    console.log(envContent);
}
