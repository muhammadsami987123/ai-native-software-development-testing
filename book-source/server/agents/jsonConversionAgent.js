import { GoogleGenerativeAI } from '@google/generative-ai';

export class JSONConversionAgent {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async convertQuery(query, context) {
    const prompt = `You are a JSON Conversion Agent. Your role is to structure user queries into a standardized JSON format for processing.

Context:
- Is In Tone: ${context.isInTone}
- Confidence: ${context.confidence}
- Project Context: ${context.projectContext || 'AI Native Software Development - A book about AI-driven development, Python, TypeScript, and agentic AI systems'}

User Query: "${query}"

Convert this query into a structured JSON object with the following schema:
{
  "intent": "string (one of: question, command, clarification, general)",
  "topics": ["array of relevant topics"],
  "keywords": ["array of important keywords"],
  "requiresContext": boolean,
  "complexity": "string (simple, medium, complex)",
  "expectedResponseType": "string (explanation, code, example, reference, search)"
}

Return ONLY valid JSON, no additional text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      // Extract JSON from response (handle markdown code blocks if present)
      let jsonText = text;
      if (text.includes('```json')) {
        jsonText = text.split('```json')[1].split('```')[0].trim();
      } else if (text.includes('```')) {
        jsonText = text.split('```')[1].split('```')[0].trim();
      }

      const structured = JSON.parse(jsonText);

      // Ensure all required fields exist
      return {
        intent: structured.intent || 'question',
        topics: structured.topics || [],
        keywords: structured.keywords || [],
        requiresContext: structured.requiresContext !== undefined ? structured.requiresContext : true,
        complexity: structured.complexity || 'medium',
        expectedResponseType: structured.expectedResponseType || 'explanation'
      };
    } catch (error) {
      console.error('Error in JSONConversionAgent:', error);
      // Return default structure on error
      return {
        intent: 'question',
        topics: [],
        keywords: query.split(' ').filter(w => w.length > 3),
        requiresContext: true,
        complexity: 'medium',
        expectedResponseType: 'explanation'
      };
    }
  }
}
