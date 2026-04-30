import express from "express";
import SiteConfig from "../Schema/configSchema.js";
import cookieValidation from "../middleware/cookieValidatin.js";

const router = express.Router();

// GET /config — Public: fetch the dynamic site config
router.get("/", async (req, res) => {
    try {
        console.log("[CONFIG] Fetching site configuration...");
        
        let config = await SiteConfig.findOne({ _singleton: true });
        
        if (!config) {
            console.log("[CONFIG] No config found, creating default...");
            config = await SiteConfig.create({ _singleton: true });
            console.log("[CONFIG] Default config created successfully");
        }
        
        console.log("[CONFIG] Successfully retrieved config");
        res.json(config);
    } catch (error) {
        console.error("[CONFIG ERROR] Failed to fetch/create config:", error.message);
        console.error("[CONFIG ERROR] Stack:", error.stack);
        
        // Return fallback defaults if database fails
        const fallbackConfig = {
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
            _singleton: true,
            error: false,
            message: "Using fallback defaults - database may be unavailable"
        };
        
        console.log("[CONFIG] Returning fallback defaults due to error");
        res.status(200).json(fallbackConfig);
    }
});

// PUT /config — Protected: admin updates site config
router.put("/", cookieValidation, async (req, res) => {
    try {
        console.log("[CONFIG UPDATE] Updating site configuration...");
        
        const {
            email, phone, location,
            name, tagline, bio, cvLink,
            socialLinks
        } = req.body;

        const updated = await SiteConfig.findOneAndUpdate(
            { _singleton: true },
            {
                $set: {
                    ...(email !== undefined && { email }),
                    ...(phone !== undefined && { phone }),
                    ...(location !== undefined && { location }),
                    ...(name !== undefined && { name }),
                    ...(tagline !== undefined && { tagline }),
                    ...(bio !== undefined && { bio }),
                    ...(cvLink !== undefined && { cvLink }),
                    ...(socialLinks !== undefined && { socialLinks }),
                }
            },
            { new: true, upsert: true }
        );

        console.log("[CONFIG UPDATE] Configuration updated successfully");
        res.json({ message: "Site configuration updated successfully", config: updated });
    } catch (error) {
        console.error("[CONFIG UPDATE ERROR] Failed to update config:", error.message);
        console.error("[CONFIG UPDATE ERROR] Stack:", error.stack);
        res.status(500).json({ error: error.message, message: "Failed to update configuration" });
    }
});

export default router;
