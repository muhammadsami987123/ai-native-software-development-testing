import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Basic Auth Middleware
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Missing Authorization Header' });
    }

    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    if (user === process.env.ADMIN_USERNAME && pass === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

// Get all users
router.get('/users', basicAuth, async (req, res) => {
    try {
        const users = await mongoose.connection.db.collection('user').find({}).toArray();

        // Sanitize users (remove sensitive info if any)
        const sanitizedUsers = users.map(user => ({
            _id: user._id,
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            aiExperience: user.aiExperience,
            codingExperience: user.codingExperience,
            createdAt: user.createdAt
        }));

        res.json(sanitizedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export { router as adminRouter };
