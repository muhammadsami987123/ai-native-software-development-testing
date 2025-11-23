import express from 'express';
import { processChatMessage } from '../services/chatService.js';

const router = express.Router();

router.post('/message', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    const response = await processChatMessage(message, conversationHistory);

    res.json(response);
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message
    });
  }
});

export const chatRouter = router;
