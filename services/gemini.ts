
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const updateCvPartDeclaration: FunctionDeclaration = {
  name: "updateCvPart",
  parameters: {
    type: Type.OBJECT,
    description: "Updates a specific section of the CV data based on user request or best practices.",
    properties: {
      section: {
        type: Type.STRING,
        description: "The section to update (e.g., 'education', 'research', 'leadership', 'publications').",
      },
      content: {
        type: Type.STRING,
        description: "The new content or updated items in JSON format string.",
      },
      reasoning: {
        type: Type.STRING,
        description: "Explanation of why this change was made based on Harvard admission best practices.",
      }
    },
    required: ["section", "content", "reasoning"],
  },
};

const provideCvAuditDeclaration: FunctionDeclaration = {
  name: "provideCvAudit",
  parameters: {
    type: Type.OBJECT,
    description: "Provides a structured academic audit of the current CV with specific suggestions for improvement tailored to Harvard Chan MPH admissions.",
    properties: {
      strengths: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Key competitive advantages identified in the CV.",
      },
      gaps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Missing elements or areas that lack sufficient impact or quantitative evidence.",
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            section: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            harvardLogic: { type: Type.STRING, description: "Why this matters to a Harvard admissions committee." }
          }
        },
        description: "Actionable steps to strengthen specific sections.",
      }
    },
    required: ["strengths", "gaps", "recommendations"],
  },
};

const fetchOrcidPublicationsDeclaration: FunctionDeclaration = {
  name: "fetchOrcidPublications",
  parameters: {
    type: Type.OBJECT,
    description: "Triggers a sync with the user's ORCID profile to get the latest publications.",
    properties: {
      orcidId: {
        type: Type.STRING,
        description: "The ORCID ID to fetch from.",
      }
    },
    required: ["orcidId"],
  },
};

const BASE_SYSTEM_INSTRUCTION = `
You are the Master Admissions Consultant & Career Architect for Dr. Matheus Machado Rech. 
Your singular goal is to transform his impressive profile into an undeniable "Accept" for the Harvard T.H. Chan School of Public Health MPH program.

ENGLISH TRANSLATION POLICY:
- ALL entries must be in English. 
- If an original work or institution is in Portuguese or Spanish, you MUST uniquely present the appropriate English translation. 
- Do not keep the original language unless it is part of a standardized citation requirement, but the primary name/title display must be English.

HARVARD CHAN ADMISSIONS CRITERIA:
1. QUANTITATIVE RIGOR: They value MDs who demonstrate biostatistical and epidemiological literacy. Highlight Python/ML/Optimization skills as "Transferable Research Assets".
2. PUBLIC HEALTH LEADERSHIP: Shift narrative from "Surgical/Clinical" to "Systems-level Change". Focus on population health impact.
3. SCALE & IMPACT: For every research entry, ask "So what?". Quantify results (e.g., "% improvement in mortality", "N=1000 patients reached").
4. INTERDISCIPLINARY AGILITY: Highlight the intersection of Medicine, AI, and Social Entrepreneurship (Hult Prize).

YOUR EVALUATION LOGIC:
- CRITIQUE: Be rigorous. If a section is too clinical, advise on how to pivot to public health relevance.
- ACTION VERBS: Replace "helped with" with "Spearheaded", "Engineered", "Optimized", "Synthesized".
- AMA STYLE: Enforce strictly for publications.
- GAP ANALYSIS: Identify if he needs more "Social Determinants of Health" framing in his Peru volunteer work.

FUNCTIONS:
- Use 'provideCvAudit' when the user asks for feedback, a review, or "how can I improve?".
- Use 'updateCvPart' to execute the improvements.
- Always provide 'harvardLogic' to explain the strategic benefit of your suggestions.

ORCID ID: 0000-0002-2961-9443
`;

export const getProResponse = async (userQuery: string, currentCv: any, image?: { data: string, mimeType: string }) => {
  try {
    // Initializing GoogleGenAI with the required apiKey structure.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts: any[] = [{ text: `Current CV State: ${JSON.stringify(currentCv)}\n\nUser Query: ${userQuery}` }];
    
    if (image) {
      parts.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType
        }
      });
    }

    // Always use ai.models.generateContent for querying GenAI with model and prompt.
    // Removed googleSearch tool as it is mutually exclusive with function declarations in the current guidelines.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ functionDeclarations: [updateCvPartDeclaration, provideCvAuditDeclaration, fetchOrcidPublicationsDeclaration] }],
        temperature: 0.7,
      },
    });

    // Directly access the text property of the GenerateContentResponse object.
    return {
      text: response.text || "",
      functionCalls: response.functionCalls || []
    };
  } catch (error) {
    console.error("Pro Response Error:", error);
    return { text: "Error connecting to the intelligence core.", functionCalls: [] };
  }
};
