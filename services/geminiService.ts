
import { GoogleGenAI, Type } from "@google/genai";
import { PokemonCard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const POKEMON_CARD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The name of the Pokemon" },
    hp: { type: Type.STRING, description: "The HP value of the Pokemon" },
    type: { type: Type.STRING, description: "The type of the Pokemon (e.g. Fire, Water, Psychic)" },
    stage: { type: Type.STRING, description: "The evolution stage (e.g. Basic, Stage 1, VSTAR, EX)" },
    abilities: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of ability names on the card"
    },
    attacks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          damage: { type: Type.STRING },
          cost: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING }
        },
        required: ["name"]
      }
    },
    weakness: { type: Type.STRING },
    resistance: { type: Type.STRING },
    retreatCost: { type: Type.INTEGER },
    description: { type: Type.STRING, description: "Flavor text at the bottom of the card" },
    set: { type: Type.STRING, description: "The card set name or symbol description" },
    rarity: { type: Type.STRING, description: "The rarity of the card" }
  },
  required: ["name", "hp", "type", "stage"]
};

export const scanPokemonCard = async (base64Image: string): Promise<Partial<PokemonCard>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Identify this Pokemon trading card. Extract all relevant details including attacks, HP, type, stage, and description. Be precise with the text extraction. If you can't see some details, make your best guess based on common card variants."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: POKEMON_CARD_SCHEMA
      }
    });

    if (!response.text) {
      throw new Error("No data returned from AI");
    }

    const data = JSON.parse(response.text);
    return {
      ...data,
      id: crypto.randomUUID(),
      scannedAt: Date.now()
    };
  } catch (error) {
    console.error("Gemini Scan Error:", error);
    throw error;
  }
};
