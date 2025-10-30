
import { GoogleGenAI, Modality, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
};

export const generateCaptions = async (imageBase64: string, mimeType: string): Promise<string[]> => {
  try {
    const imagePart = fileToGenerativePart(imageBase64, mimeType);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { text: "Analyze this image and generate 5 funny, viral-worthy meme captions. The captions should be short, witty, and highly shareable." },
          imagePart
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
          }
        },
      }
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText);
    return result.captions || [];
  } catch (error) {
    console.error("Error generating captions:", error);
    throw new Error("Failed to generate captions. Please try again.");
  }
};


export const analyzeImage = async (imageBase64: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = fileToGenerativePart(imageBase64, mimeType);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { text: "Provide a brief, one-paragraph description of this image." },
                    imagePart
                ]
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze image.");
    }
};

export const editImage = async (imageBase64: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const imagePart = fileToGenerativePart(imageBase64, mimeType);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image was generated.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image.");
  }
};
