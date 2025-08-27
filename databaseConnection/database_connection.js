import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";

// Ensure database name is set to 'portfolio'
const ensureDatabaseName = (uri) => {
    if (uri.includes('mongodb+srv://') && !uri.includes('/portfolio')) {
        // If it's MongoDB Atlas and no database specified, add portfolio
        if (uri.includes('?')) {
            return uri.replace('?', '/portfolio?');
        } else {
            return uri + '/portfolio';
        }
    }
    return uri;
};

const finalUri = ensureDatabaseName(MONGODB_URI);

// MongoDB Atlas connection options
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    retryWrites: true,
    w: "majority"
};

// Database connection function
const connectDB = async () => {
    try {
        console.log("🔍 Connecting to MongoDB Atlas...");
        console.log(`🌐 URI: ${finalUri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
        
        const conn = await mongoose.connect(finalUri, connectionOptions);
        
        console.log(`✅ MongoDB Atlas connected successfully!`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🌐 Host: ${conn.connection.host}`);
        console.log(`🔌 Port: ${conn.connection.port}`);
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('🎉 Mongoose connected to MongoDB Atlas');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🔌 Mongoose disconnected from MongoDB Atlas');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('🔄 MongoDB Atlas connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('❌ Error during MongoDB Atlas connection closure:', err);
                process.exit(1);
            }
        });

        return conn;
    } catch (error) {
        console.error('❌ MongoDB Atlas connection failed:', error.message);
        console.error('🔍 Please check your connection string and network connection');
        console.error('💡 Make sure your IP address is whitelisted in MongoDB Atlas');
        process.exit(1);
    }
};

// Initialize database connection
let DataBase;
try {
    await connectDB();
    DataBase = mongoose;
} catch (error) {
    console.error('❌ Failed to initialize database connection:', error);
    process.exit(1);
}

export default DataBase;
