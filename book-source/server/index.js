import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import mongoose from 'mongoose';
import { chatRouter } from './routes/chat.js';
import { summaryRouter } from './routes/summary.js';
import { assessmentRouter } from './routes/assessment.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3001;

// Connect Mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected via Mongoose'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: '20mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chatbot API is running' });
});

// Auth Route
app.all("/api/auth/*", toNodeHandler(auth));

// API routes
app.use('/api/chat', chatRouter);
app.use('/api/assessment', assessmentRouter);
app.use('/api/summary', summaryRouter);

// Check Personalization Completion
app.get('/api/user/check-personalization', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return res.json({ completed: false });
    }

    // Try to find user with preferences using upsert pattern
    const user = await mongoose.connection.db.collection('user_preferences').findOne({
      userId: session.user.id
    });

    const completed = !!(user?.aiExperience && user?.codingExperience);

    console.log(`✨ Personalization check for ${session.user.id}: ${completed}`);

    res.json({ completed });
  } catch (e) {
    console.error("❌ Error checking personalization:", e);
    res.json({ completed: false });
  }
});

// Update Preferences Route - Use upsert to create/update
app.post('/api/user/preferences', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { aiExperience, codingExperience } = req.body;

    console.log(`📝 Saving preferences for user ${session.user.id}`);

    // Use updateOne with upsert to create if doesn't exist
    const result = await mongoose.connection.db.collection('user_preferences').updateOne(
      { userId: session.user.id },
      {
        $set: {
          aiExperience,
          codingExperience,
          updatedAt: new Date()
        },
        $setOnInsert: {
          userId: session.user.id,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log(`✅ Preferences saved:`, result.upsertedCount ? 'Created new' : 'Updated existing');

    res.json({ success: true });
  } catch (e) {
    console.error("❌ Error updating preferences:", e);
    res.status(500).json({ error: e.message });
  }
});

// Explanation Route
app.post('/api/explanation/generate', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { pageTitle, pagePath } = req.body;
    const userId = session.user.id;

    // Check if explanation already exists
    const existingExplanation = await mongoose.connection.db.collection('explanations').findOne({
      userId,
      pagePath,
      pageTitle
    });

    if (existingExplanation) {
      console.log('📦 Returning cached explanation for:', pageTitle);
      return res.json({ explanation: existingExplanation.content, cached: true });
    }

    // Get user preferences
    const userPrefs = await mongoose.connection.db.collection('user_preferences').findOne({ userId });
    const aiLevel = userPrefs?.aiExperience || 'Beginner';
    const codingLevel = userPrefs?.codingExperience || 'Beginner';

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert educator. Create a personalized explanation of "${pageTitle}" for a student with ${aiLevel} AI experience and ${codingLevel} coding experience.

CRITICAL RULES:
1. OUTPUT ONLY THE HTML CONTENT - NO meta-text like "html" or "Here is..." 
2. Start directly with the content (e.g., <h3>...)
3. Use ONLY these HTML tags:
   - <h3> for main headings
   - <h4> for sub-headings  
   - <ul> and <li> for bullet points
   - <p> for paragraphs
   - <strong> for emphasis
   - <code> for technical terms
   - <br> for line breaks if needed

4. STRUCTURE:
   - Begin with a brief introduction paragraph
   - Use 2-4 main sections with <h3> headings
   - Include bullet points for key concepts
   - Add examples relevant to their experience level
   - End with practical takeaways

5. TONE & DEPTH:
   - Adjust complexity based on experience levels
   - For beginners: use simple language, more examples
   - For experts: be concise, focus on advanced concepts
   - Be encouraging and clear

6. WHAT TO AVOID:
   - NO code block markers (\`\`\`)
   - NO markdown syntax (#, **, etc.)
   - NO meta-commentary about the content
   - NO phrases like "Here is the explanation" or "html"
   - NO incomplete sentences

OUTPUT (start directly with HTML):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up
    text = text.replace(/^(html|HTML)\s*/i, '');
    text = text.replace(/^```html\s*/i, '');
    text = text.replace(/```\s*$/i, '');
    text = text.trim();

    // Save to database
    await mongoose.connection.db.collection('explanations').insertOne({
      userId,
      pagePath,
      pageTitle,
      content: text,
      aiLevel,
      codingLevel,
      createdAt: new Date()
    });

    console.log('✅ Generated and saved new explanation for:', pageTitle);
    res.json({ explanation: text, cached: false });
  } catch (e) {
    console.error('Error generating explanation:', e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Chatbot API server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set GEMINI_API_KEY in your .env file`);
});
