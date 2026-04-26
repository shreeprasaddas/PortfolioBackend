import express from "express";
import SiteConfig from "../Schema/configSchema.js";
import cookieValidation from "../middleware/cookieValidatin.js";

const router = express.Router();

// GET /config — Public: fetch the dynamic site config
router.get("/", async (req, res) => {
    try {
        let config = await SiteConfig.findOne({ _singleton: true });
        if (!config) {
            config = await SiteConfig.create({ _singleton: true });
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /config — Protected: admin updates site config
router.put("/", cookieValidation, async (req, res) => {
    try {
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

        res.json({ message: "Site configuration updated successfully", config: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
