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

// Seed initial config if collection is empty
export async function seedConfig() {
    try {
        const existing = await SiteConfig.findOne({ _singleton: true });
        if (!existing) {
            await SiteConfig.create({ _singleton: true });
            console.log("✅ Default site config seeded.");
        }
    } catch (err) {
        console.error("Config seed error:", err.message);
    }
}

export default SiteConfig;
