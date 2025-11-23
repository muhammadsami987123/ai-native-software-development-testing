import { GoogleGenerativeAI } from '@google/generative-ai';

export class AssessmentService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async extractTopics({ content }) {
    const sanitizedContent = content?.trim();

    if (!sanitizedContent || sanitizedContent.length < 50) {
      throw new Error('Content is too short to extract meaningful topics');
    }

    const prompt = `You are a topic extraction expert for educational content.
Analyze the following page content and extract the main topics discussed.

Content:
${sanitizedContent.substring(0, 8000)}

Output strict JSON with this shape (NO prose, markdown, or code fences):
{
  "topics": [
    "Topic 1 Name",
    "Topic 2 Name",
    "Topic 3 Name"
  ]
}

Rules:
- Extract 3-8 distinct topics that represent the main concepts discussed
- Use concise, clear topic names (3-6 words each)
- Focus on educational concepts, not just section titles
- Order topics by importance/prominence in the content
- Avoid generic terms like "Introduction" or "Overview"`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const payload = this.extractJson(text);

    const topics = Array.isArray(payload.topics)
      ? payload.topics.filter(t => typeof t === 'string' && t.trim().length > 0)
      : [];

    if (!topics.length) {
      throw new Error('The AI could not extract any topics from the content');
    }

    return {
      topics: topics.slice(0, 10), // Limit to max 10 topics
      meta: {
        totalTopics: topics.length,
        contentLength: sanitizedContent.length,
      },
    };
  }

  async generateAssessment({ questionCount, difficulty, topic, examType, pageContent }) {
    const sanitizedTopic = topic?.trim() || 'AI Native Software Development';
    const sanitizedExamType = examType?.trim() || 'General Assessment';
    const clampedCount = Math.max(1, Number(questionCount) || 5);

    // Build the prompt with page content if available
    let prompt = `You are an assessment generator for an AI engineering course.
Create ${clampedCount} multiple-choice questions for the "${sanitizedExamType}" exam.

Parameters:
- Topic: ${sanitizedTopic}
- Difficulty: ${difficulty}
`;

    // Include page content if provided
    if (pageContent && pageContent.trim().length > 100) {
      const contentSnippet = pageContent.substring(0, 6000); // Limit to 6000 chars
      prompt += `
SOURCE CONTENT (PRIORITIZE THIS):
The questions MUST be based on the following lesson content. Do not use general knowledge - only create questions from concepts, examples, and information explicitly covered in this content:

${contentSnippet}

---
`;
    }

    prompt += `
Output strict JSON with this shape (NO prose, markdown, or code fences):
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0,
      "explanation": "Why the answer is correct"
    }
  ]
}

Rules:
- Always provide exactly 4 unique options per question.
- ${pageContent ? 'Generate questions ONLY from the provided source content above. Reference specific concepts, examples, or terminology from the content.' : 'Use course-appropriate content.'}
- Use advanced vocabulary only if difficulty is "professional".
- Keep explanations concise (1-2 sentences).
- Ensure all options are plausible to someone who hasn't studied the content.`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const payload = this.extractJson(text);

    const questions = Array.isArray(payload.questions)
      ? payload.questions.map((question, index) => this.normalizeQuestion(question, index))
      : [];

    if (!questions.length) {
      throw new Error('The AI did not return any questions. Please try again.');
    }

    return {
      questions,
      meta: {
        questionCount: questions.length,
        difficulty,
        topic: sanitizedTopic,
        examType: sanitizedExamType,
        basedOnPageContent: !!pageContent,
      },
    };
  }

  extractJson(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse assessment JSON:', text);
      throw new Error('Could not parse AI response. Please try again.');
    }
  }

  normalizeQuestion(question, index) {
    const fallbackQuestion = `Question ${index + 1}`;
    const fallbackOptions = ['Option A', 'Option B', 'Option C', 'Option D'];

    let options = Array.isArray(question.options) ? question.options.slice(0, 4) : [];
    while (options.length < 4) {
      options.push(`Option ${String.fromCharCode(65 + options.length)}`);
    }

    return {
      id: `q-${index}`,
      question: question.question?.trim() || fallbackQuestion,
      options,
      answerIndex:
        typeof question.answerIndex === 'number' && question.answerIndex >= 0 && question.answerIndex < 4
          ? question.answerIndex
          : 0,
      explanation: question.explanation?.trim() || 'Review the associated chapter to reinforce the concept.',
    };
  }
}

const assessmentService = new AssessmentService();

export async function generateAssessment(payload) {
  return assessmentService.generateAssessment(payload);
}

export async function extractTopics(payload) {
  return assessmentService.extractTopics(payload);
}

export { AssessmentService as AssessmentServiceClass };
