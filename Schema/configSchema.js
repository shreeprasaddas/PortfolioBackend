import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    // Contact Info
    email: {
        type: String,
        default: "shreepsd2@gmail.com"
    },
    phone: {
        type: String,
        default: "+977 9825752227"
    },
    location: {
        type: String,
        default: "Nepal"
    },
    // About Info
    name: {
        type: String,
        default: "Shreeprasad"
    },
    tagline: {
        type: String,
        default: "Full Stack Developer & Creative Technologist"
    },
    bio: {
        type: String,
        default: "Crafting digital experiences with modern web technologies. Passionate about creating scalable solutions and innovative designs."
    },
    // CV / Resume link
    cvLink: {
        type: String,
        default: ""
    },
    // Social Links
    socialLinks: {
        github: { type: String, default: "https://github.com" },
        linkedin: { type: String, default: "https://linkedin.com" },
        twitter: { type: String, default: "https://twitter.com" },
        instagram: { type: String, default: "https://instagram.com" },
        youtube: { type: String, default: "https://youtube.com" },
        facebook: { type: String, default: "" }
    },
    // Singleton marker — only one config doc will ever exist
    _singleton: {
        type: Boolean,
        default: true,
        unique: true
    }
}, {
    timestamps: true
});

const SiteConfig = mongoose.model("SiteConfig", configSchema);

// Get default/fallback configuration
export function getDefaultConfig() {
    return {
        email: "shreepsd2@gmail.com",
        phone: "+977 9825752227",
        location: "Nepal",
        name: "Shreeprasad",
        tagline: "Full Stack Developer & Creative Technologist",
        bio: "Crafting digital experiences with modern web technologies. Passionate about creating scalable solutions and innovative designs.",
        cvLink: "",
        socialLinks: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
            instagram: "https://instagram.com",
            youtube: "https://youtube.com",
            facebook: ""
        },
        _singleton: true
    };
}

// Seed initial config if collection is empty
export async function seedConfig() {
    try {
        console.log("[SEED] Attempting to seed default config...");
        
        // Check if config already exists
        const existing = await SiteConfig.findOne({ _singleton: true });
        if (existing) {
            console.log("[SEED] Config already exists, skipping seed");
            return existing;
        }
        
        // Create default config
        const defaultConfig = getDefaultConfig();
        const newConfig = await SiteConfig.create(defaultConfig);
        console.log("[SEED] ✅ Default site config seeded successfully");
        return newConfig;
    } catch (err) {
        console.error("[SEED ERROR] Failed to seed config:", err.message);
        console.error("[SEED ERROR] This is not critical - defaults will be used");
        // Don't throw, just log - defaults will be used
        return null;
    }
}

export default SiteConfig;
