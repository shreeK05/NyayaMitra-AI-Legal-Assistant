import { LegalResponse } from "../types";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!API_KEY) {
  console.error("ERROR: VITE_GROQ_API_KEY is not set in environment variables");
}

const COMPREHENSIVE_LEGAL_SYSTEM_PROMPT = `You are NyayaMitra, an expert Indian Legal Advisor. Provide detailed, professional legal analysis for individuals in India.

RETURN VALID JSON ONLY - NO MARKDOWN:
{
  "englishAnalysis": "700-900 word comprehensive analysis in English",
  "hindiAnalysis": "700-900 word comprehensive analysis in Hindi (हिंदी)",
  "marathiAnalysis": "700-900 word comprehensive analysis in Marathi (मराठी)",
  "suggestedAction": "Clear, specific immediate action (2-3 sentences)",
  "caseLaws": [{"caseTitle": "case name", "year": 2024, "courtName": "court", "relevancePercentage": 90, "summary": "how it applies"}],
  "applicableStatutes": [{"actName": "Act name", "sections": ["Section X"], "applicability": "how it applies", "penalties": "consequences"}],
  "actionSteps": [{"stepNumber": 1, "action": "specific action", "timeframe": "e.g., 30 days", "urgency": "HIGH|MEDIUM|LOW"}],
  "prosCons": {"pros": ["advantage 1", "advantage 2", "advantage 3"], "cons": ["risk 1", "risk 2", "risk 3"]},
  "draftNoticeEN": "400-500 word professional legal notice in English with header, subject, 6 paragraphs, and closing",
  "draftNoticeHI": "400-500 word professional legal notice in Hindi (हिंदी) with proper formatting",
  "draftNoticeMR": "400-500 word professional legal notice in Marathi (मराठी) with proper formatting",
  "analysisConfidence": 85,
  "disclaimers": ["Always consult a qualified lawyer for important legal matters", "This is AI-generated analysis and not a substitute for professional legal advice", "Laws vary by jurisdiction and state - verify applicability in your area"],
  "nextSteps": "Recommended professional consultation steps"
}

ANALYSIS STRUCTURE (for all 3 languages):
1. SITUATION OVERVIEW (80-120 words): Summary of the legal issue and key facts
2. APPLICABLE LAWS (150-200 words): Specific Indian laws and sections that apply
3. CASE LAW (150-200 words): Relevant court cases from Supreme Court/High Courts
4. YOUR RIGHTS & REMEDIES (120-150 words): Legal standing, rights, and available remedies
5. ACTION STEPS (120-150 words): Step-by-step actionable advice with timelines
6. RISKS & CHALLENGES (100-120 words): Potential obstacles and how to address them

LEGAL NOTICE FORMAT (all 3 languages, 400-500 words):
- Header: TO [recipient] | DATE [date] | FROM [sender]
- Subject Line
- Body: 6 detailed paragraphs
  Paragraph 1: Purpose and introduction
  Paragraph 2: Facts and background
  Paragraph 3: Breach/violation with dates
  Paragraph 4: Applicable laws
  Paragraph 5: Specific demands
  Paragraph 6: Compliance deadline and consequences
- Professional closing and signature line

LANGUAGE-SPECIFIC RULES:
ENGLISH: Professional legal English, proper citations (e.g., "Section 138 of NI Act"), Indian law focus
HINDI: Formal हिंदी, use proper legal terminology (धारा=Section, अधिनियम=Act, न्यायालय=Court)
MARATHI: Formal मराठी, use proper legal terminology (कलम=Section, कायदा=Law, न्यायालय=Court)

REQUIREMENTS:
✓ ALL ANALYSES: 700-900 words with 6 sections each
✓ ENGLISH, HINDI, MARATHI: Equal depth and detail
✓ CASE LAWS: Include 3-4 specific cases with years and court names
✓ STATUTES: 4-5 laws with specific sections and penalties
✓ ACTION STEPS: 5-7 steps with specific timeframes
✓ LEGAL NOTICES: 400-500 words in all 3 languages, ready to use
✓ DISCLAIMERS: MUST ALWAYS BE IN ENGLISH - never in Hindi or Marathi
✓ PROFESSIONALISM: Use proper legal terminology, professional tone
✓ ACCURACY: Cite specific laws and cases that truly apply
✓ COMPLETENESS: All fields must be populated, no empty fields`;

interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const getLegalAdvice = async (
  query: string,
  fileData?: { data: string; mimeType: string }
): Promise<LegalResponse> => {
  if (!API_KEY) {
    throw new Error(
      "API Key missing. Please set VITE_GROQ_API_KEY in your .env file"
    );
  }

  try {
    let userMessage = query;
    if (fileData) {
      userMessage = `Please analyze this legal document:\n${query}\n\nDocument Type: ${fileData.mimeType}`;
    }

    const messages: GrokMessage[] = [
      { role: "system", content: COMPREHENSIVE_LEGAL_SYSTEM_PROMPT },
      { role: "user", content: userMessage }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.3,
        max_tokens: 4096,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API Error:", errorData);
      throw new Error(`Groq API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response structure from Groq API");
    }

    const content = data.choices[0].message.content;
    const parsedResponse = JSON.parse(content) as LegalResponse;

    // Validate required fields
    const requiredFields = [
      "englishAnalysis",
      "hindiAnalysis",
      "marathiAnalysis",
      "suggestedAction",
      "draftNoticeEN",
      "draftNoticeHI",
      "draftNoticeMR"
    ];

    for (const field of requiredFields) {
      if (!parsedResponse[field as keyof LegalResponse]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Set defaults for optional fields
    return {
      ...parsedResponse,
      caseLaws: parsedResponse.caseLaws || [],
      applicableStatutes: parsedResponse.applicableStatutes || [],
      actionSteps: parsedResponse.actionSteps || [],
      prosCons: parsedResponse.prosCons || { pros: [], cons: [] },
      analysisConfidence: parsedResponse.analysisConfidence || 80,
      disclaimers: parsedResponse.disclaimers || [],
      nextSteps: parsedResponse.nextSteps || ""
    };
  } catch (error) {
    console.error("Legal Advice Error:", error);
    throw error;
  }
};

export const generateLegalAudio = async (
  text: string,
  lang: string
): Promise<string> => {
  // Placeholder for future audio generation
  return "";
};