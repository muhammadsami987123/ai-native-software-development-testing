import express from 'express';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { auth } from '../auth.js';

const router = express.Router();

// Update Profile Route
router.post('/update-profile', async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { name, image } = req.body;
        const userId = session.user.id;

        // Update user in database
        const result = await mongoose.connection.db.collection('user').updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    name,
                    image,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log(`✅ Profile updated for user ${userId}`);
        res.json({ success: true });

    } catch (error) {
        console.error("❌ Error updating profile:", error);
        res.status(500).json({ error: error.message });
    }
});

export { router as userRouter };
