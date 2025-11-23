import express from 'express';
import { generateAssessment, extractTopics } from '../services/assessmentService.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const {
      questionCount = 5,
      difficulty = 'medium',
      topic = 'AI Native Software Development',
      examType = 'General Assessment',
      pageContent,
    } = req.body || {};

    const parsedCount = Number(questionCount);
    if (Number.isNaN(parsedCount) || parsedCount <= 0) {
      return res.status(400).json({ error: 'questionCount must be a positive number' });
    }

    console.log('📝 Generating assessment with page content:', !!pageContent, 'length:', pageContent?.length || 0);

    const payload = await generateAssessment({
      questionCount: parsedCount,
      difficulty: String(difficulty).toLowerCase(),
      topic,
      examType,
      pageContent,
    });

    res.json(payload);
  } catch (error) {
    console.error('Assessment generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate assessment',
      message: error.message,
    });
  }
});

router.post('/extract-topics', async (req, res) => {
  try {
    const { content } = req.body || {};

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'content is required and must be a string' });
    }

    if (content.trim().length < 50) {
      return res.status(400).json({ error: 'content is too short (minimum 50 characters)' });
    }

    const payload = await extractTopics({ content });

    res.json(payload);
  } catch (error) {
    console.error('Topic extraction failed:', error);
    res.status(500).json({
      error: 'Failed to extract topics',
      message: error.message,
    });
  }
});

export const assessmentRouter = router;
