import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Test MongoDB Atlas connection
const testConnection = async () => {
    console.log("🔍 Testing MongoDB Atlas connection...");
    console.log("📋 Environment variables loaded:");
    console.log(`   - MONGODB_URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ Not set"}`);
    console.log(`   - NODE_ENV: ${process.env.NODE_ENV || "development"}`);
    
    if (!process.env.MONGODB_URI) {
        console.error("❌ MONGODB_URI is not set in your .env file!");
        console.error("💡 Please create a .env file with your MongoDB Atlas connection string");
        process.exit(1);
    }

    try {
        console.log("🔄 Attempting to connect to MongoDB Atlas...");
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            w: "majority"
        });

        console.log("✅ MongoDB Atlas connection successful!");
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🌐 Host: ${conn.connection.host}`);
        console.log(`🔌 Port: ${conn.connection.port}`);
        console.log(`📈 Ready State: ${conn.connection.readyState}`);
        
        // Test a simple operation
        const collections = await conn.connection.db.listCollections().toArray();
        console.log(`📚 Collections found: ${collections.length}`);
        if (collections.length > 0) {
            console.log("📋 Collections:", collections.map(c => c.name).join(", "));
        }
        
        // Close connection
        await mongoose.connection.close();
        console.log("🔌 Connection closed successfully");
        console.log("🎉 MongoDB Atlas connection test passed!");
        
    } catch (error) {
        console.error("❌ MongoDB Atlas connection failed!");
        console.error("🔍 Error details:", error.message);
        
        if (error.message.includes("ENOTFOUND")) {
            console.error("💡 This usually means the cluster URL is incorrect");
        } else if (error.message.includes("Authentication failed")) {
            console.error("💡 Check your username and password");
        } else if (error.message.includes("ECONNREFUSED")) {
            console.error("💡 Check if your IP is whitelisted in MongoDB Atlas");
        } else if (error.message.includes("ETIMEDOUT")) {
            console.error("💡 Network timeout - check your internet connection");
        }
        
        console.error("📖 Please refer to the setup guide in config/mongodb-atlas-setup.md");
        process.exit(1);
    }
};

// Run the test
testConnection();
