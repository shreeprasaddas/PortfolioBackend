import express from "express";
import form from "../Schema/formSchema.js";
import cookieValidation from "../middleware/cookieValidatin.js";

const router = express.Router();

// Get all contact form submissions (Protected route)
router.get("/", cookieValidation, async (req, res) => {
    try {
        const forms = await form.find().sort({ _id: -1 }); // Latest first
        res.json(forms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific contact form by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const contactForm = await form.findById(id);
        
        if (!contactForm) {
            return res.status(404).json({ error: "Contact form not found" });
        }
        
        res.json(contactForm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a contact form submission (Protected route)
router.delete("/:id", cookieValidation, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedForm = await form.findByIdAndDelete(id);
        
        if (!deletedForm) {
            return res.status(404).json({ error: "Contact form not found" });
        }
        
        res.json({ message: "Contact form deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark contact form as replied (Protected route)
router.patch("/:id/reply", cookieValidation, async (req, res) => {
    try {
        const { id } = req.params;
        const { replyMessage } = req.body;
        
        const updatedForm = await form.findByIdAndUpdate(
            id, 
            { 
                replied: true, 
                replyMessage: replyMessage,
                repliedAt: new Date()
            }, 
            { new: true }
        );
        
        if (!updatedForm) {
            return res.status(404).json({ error: "Contact form not found" });
        }
        
        res.json({ message: "Reply recorded successfully", form: updatedForm });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get statistics about contact forms
router.get("/stats/summary", async (req, res) => {
    try {
        const totalForms = await form.countDocuments({});
        const repliedForms = await form.countDocuments({ replied: true });
        const pendingForms = totalForms - repliedForms;
        
        // Get recent forms (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentForms = await form.countDocuments({ 
            createdAt: { $gte: weekAgo } 
        });
        
        res.json({
            total: totalForms,
            replied: repliedForms,
            pending: pendingForms,
            recent: recentForms
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
