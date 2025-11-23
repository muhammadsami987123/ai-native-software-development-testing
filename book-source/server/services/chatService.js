import { JSONConversionAgent } from '../agents/jsonConversionAgent.js';
import { AnswerAgent } from '../agents/answerAgent.js';
import { ToneTester } from '../agents/toneTester.js';
import { ProjectContextIndexer } from '../utils/projectContextIndexer.js';

export class ChatService {
  constructor() {
    this.jsonAgent = new JSONConversionAgent();
    this.answerAgent = new AnswerAgent();
    this.toneTester = new ToneTester();
    this.contextIndexer = new ProjectContextIndexer();
    this.smallTalkPatterns = [
      { regex: /^hi( there)?$/, category: 'greeting' },
      { regex: /^hello( there)?$/, category: 'greeting' },
      { regex: /^hey( there| team)?$/, category: 'greeting' },
      { regex: /^howdy$/, category: 'greeting' },
      { regex: /^hiya$/, category: 'greeting' },
      { regex: /^heya$/, category: 'greeting' },
      { regex: /^yo$/, category: 'greeting' },
      { regex: /^sup$/, category: 'casual' },
      { regex: /^what'?s up$/, category: 'casual' },
      { regex: /^good (morning|afternoon|evening)$/, category: 'greeting' },
      { regex: /^morning$/, category: 'greeting' },
      { regex: /^afternoon$/, category: 'greeting' },
      { regex: /^evening$/, category: 'greeting' },
      { regex: /^how are you$/, category: 'wellbeing' },
      { regex: /^how are you doing$/, category: 'wellbeing' },
      { regex: /^how'?s it going$/, category: 'wellbeing' },
      { regex: /^how are things$/, category: 'wellbeing' },
      { regex: /^how is everything$/, category: 'wellbeing' },
      { regex: /^how do you do$/, category: 'wellbeing' }
    ];
    this.smallTalkResponses = {
      greeting: [
        'Hi there! 👋',
        'Hello! Ready when you are.',
        'Hey! What should we dive into?'
      ],
      wellbeing: [
        'I’m doing well, thanks! How can I help you?',
        'Feeling great—ready to jump in whenever you are.',
        'All good here! What can I walk you through?'
      ],
      casual: [
        'All set on my end. What’s next?',
        'Still here and ready—what can I help with?',
        'Everything’s running smoothly. Need anything?'
      ]
    };
  }

  async processMessage(message, conversationHistory) {
    try {
      const trimmedMessage = typeof message === 'string' ? message.trim() : '';

      const smallTalkCategory = this.detectSmallTalk(trimmedMessage);
      if (smallTalkCategory) {
        return this.buildSmallTalkResponse(smallTalkCategory, conversationHistory);
      }

      // Detect if this is a summary request
      const isSummaryRequest = this.detectSummaryRequest(trimmedMessage);

      // Optimize: Run context indexing and quick tone check in parallel for faster response
      const [projectContext, quickToneCheck] = await Promise.all([
        this.contextIndexer.getRelevantContext(trimmedMessage),
        Promise.resolve(this.toneTester.quickToneCheck(trimmedMessage)) // Quick synchronous check
      ]);

      // Use quick tone check if confidence is high, otherwise do full AI check
      let toneResult = quickToneCheck;
      if (quickToneCheck.confidence < 0.7 && !isSummaryRequest) {
        // Only do full AI-based tone check if quick check is uncertain
        // Skip for summaries since they have explicit context
        toneResult = await this.toneTester.testTone(message, projectContext);
      }

      // Convert query to structured format
      const structuredQuery = await this.jsonAgent.convertQuery(trimmedMessage, {
        isInTone: toneResult.isInTone,
        confidence: toneResult.confidence,
        projectContext: projectContext.summary,
        isSummary: isSummaryRequest
      });

      // Generate answer using Answer Agent
      const answer = await this.answerAgent.generateAnswer({
        query: trimmedMessage,
        structuredQuery,
        toneResult,
        projectContext,
        conversationHistory,
        isSummary: isSummaryRequest
      });

      return {
        message: answer.text,
        isInTone: toneResult.isInTone,
        confidence: toneResult.confidence,
        sources: answer.sources || [],
        metadata: {
          structuredQuery,
          usedBrowserSearch: answer.usedBrowserSearch || false
        }
      };
    } catch (error) {
      console.error('Error in ChatService.processMessage:', error);
      throw error;
    }
  }

  detectSummaryRequest(message) {
    // Check if the message contains summary-specific patterns
    const summaryPatterns = [
      /Provide a concise.*summary/i,
      /Provide a comprehensive.*summary/i,
      /Provide a detailed summary/i,
      /Context:.*Selected Text:/s,
      /summarize the following/i,
      /summary of.*text/i
    ];

    return summaryPatterns.some(pattern => pattern.test(message));
  }

  detectSmallTalk(message) {
    if (!message) return null;

    const normalized = message.toLowerCase().trim();
    if (!normalized || normalized.length > 80) return null;
    if (/https?:\/\//.test(normalized)) return null;

    const sanitized = normalized.replace(/[^a-z\s']/g, ' ').replace(/\s+/g, ' ').trim();
    if (!sanitized) return null;

    const match = this.smallTalkPatterns.find(pattern => pattern.regex.test(sanitized));
    return match ? match.category : null;
  }

  buildSmallTalkResponse(category, conversationHistory) {
    const pools = this.smallTalkResponses[category] || this.smallTalkResponses.greeting;
    const response = pools[Math.floor(Math.random() * pools.length)];
    const followUp =
      conversationHistory && conversationHistory.length > 0
        ? response
        : response;

    return {
      message: followUp,
      isInTone: true,
      confidence: 1,
      sources: [],
      metadata: {
        structuredQuery: null,
        handledBy: 'chatService.smallTalk'
      }
    };
  }
}

const chatService = new ChatService();

export async function processChatMessage(message, conversationHistory) {
  return await chatService.processMessage(message, conversationHistory);
}

export { ChatService as ChatServiceClass };
