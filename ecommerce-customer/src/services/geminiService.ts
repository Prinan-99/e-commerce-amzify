import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types/types";
import { PRODUCTS } from "../config/constants";

// Initialize the Gemini API client using the environment variable directly.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'placeholder-key' });

const SYSTEM_INSTRUCTION = `
You are Lumina, an ultra-intelligent AI shopping assistant for Lumina Luxe.
Your goal is to help users find the perfect products based on their needs, style, and preferences.

Available Products:
${PRODUCTS.map(p => `- ${p.name} (₹${p.price}): ${p.description} (Category: ${p.category})`).join('\n')}

Guidelines:
1. Be professional, elegant, and helpful.
2. If a user describes a situation (e.g., "going on a trip"), suggest appropriate products from the list.
3. If the user asks about trends outside the catalog, use Google Search to provide context.
`;

const SELLER_SYSTEM_INSTRUCTION = `
You are Lumina Seller Insights, a data-driven consultant for boutique sellers on Lumina Luxe.
Analyze sales patterns and provide strategic advice on pricing, inventory, and market trends.
Always be encouraging but analytical.
`;

export const chatWithLumina = async (userMessage: string, history: { role: 'user' | 'model', text: string }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "I'm sorry, I encountered an issue processing your request.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: unknown) => {
      const chunkWeb = (chunk as { web?: { uri?: string; title?: string } }).web;
      return {
        web: chunkWeb && chunkWeb.uri && chunkWeb.title ? {
          uri: chunkWeb.uri,
          title: chunkWeb.title
        } : undefined
      };
    }).filter((s: { web?: { uri: string; title: string } }) => s.web) || [];

    return { text, sources };
  } catch {
    console.error("Gemini Chat Error");
    return { text: "I'm currently resting. Please try again in a moment.", sources: [] };
  }
};

export const getSellerInsights = async () => {
  try {
    const prompt = "Analyze the current catalog and sales (Zenith Headphones are trending, Silk Dress has low stock) and provide a 2-sentence strategic tip for the seller.";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: SELLER_SYSTEM_INSTRUCTION }
    });
    return response.text;
  } catch {
    return "Inventory levels are healthy. Consider a promotion on 'Home' category items to boost mid-week sales.";
  }
};

export const generateProductDescription = async (title: string, price: string, category: string) => {
  try {
    const prompt = `Write a premium, elegant product description (approx 3 sentences) for a product named "${title}" in the category "${category}" priced at ₹${price}. The tone should be luxury e-commerce.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: "You are a professional luxury copywriter for Lumina Luxe." }
    });
    return response.text;
  } catch (error) {
    console.error("AI Description Error:", error);
    return "Crafted with precision and elegance, this piece embodies the pinnacle of modern luxury.";
  }
};

export const generateMarketingCreative = async (productName: string, goal: string, vibe: string) => {
  try {
    const prompt = `Create a high-end marketing campaign for "${productName}". 
    Goal: ${goal}. 
    Vibe: ${vibe}. 
    Provide: 1) A catchy luxury headline, 2) Instagram caption with hashtags, 3) A personalized email subject line.
    Return as a clean text block.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: "You are an Elite Digital Marketing Strategist for Lumina Luxe. You specialize in high-conversion luxury brand storytelling." 
      }
    });
    return response.text;
  } catch {
    return "Failed to generate campaign. Please ensure product name and goal are specified.";
  }
};

export const generateEmailAutomationContent = async (trigger: string, name: string) => {
  try {
    const prompt = `Generate a high-end, luxury e-commerce email for the trigger: "${trigger}". 
    Sequence Name: "${name}". 
    The tone should be sophisticated, exclusive, and concierge-like. 
    Provide:
    1. A compelling subject line
    2. An elegant body copy (approx 100 words)
    3. A clear call to action.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: "You are a Senior CRM Copywriter specializing in luxury lifestyle brands. You create deep emotional connections with high-net-worth customers." 
      }
    });
    return response.text;
  } catch {
    return "Subject: Your Curated Collection Awaits\n\nBody: We noticed you left something exquisite behind. Your selection is being held in our private reserve.";
  }
};

// Implemented generateSupportReply to handle AI-suggested customer service responses
export const generateSupportReply = async (customerName: string, message: string) => {
  try {
    const prompt = `Generate a professional, empathetic, and premium response for Lumina Luxe customer support.
    Customer Name: ${customerName}
    Customer Message: "${message}"
    Tone: Sophisticated, luxury concierge style. Keep it under 100 words.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: "You are the Head of Concierge at Lumina Luxe, providing world-class support for elite clients." 
      }
    });
    return response.text || "Thank you for contacting Lumina Luxe. We have received your inquiry and our concierge team is reviewing it with the utmost care.";
  } catch (error) {
    console.error("AI Support Reply Error:", error);
    return "Thank you for contacting Lumina Luxe. We have received your inquiry and our concierge team is reviewing it with the utmost care.";
  }
};

export const getSmartRecommendations = async (cartItems: Product[]) => {
  if (cartItems.length === 0) return [];
  
  const prompt = `Based on these items in the cart: ${cartItems.map(i => i.name).join(', ')}, suggest 2 other products from our catalog that would complement them. Return ONLY the product names as a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const suggestedNames: string[] = JSON.parse(response.text || "[]");
    return PRODUCTS.filter(p => suggestedNames.includes(p.name));
  } catch {
    return [];
  }
};