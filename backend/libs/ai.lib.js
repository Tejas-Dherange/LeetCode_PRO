import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});
const LLM = async (content) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
    });
    return response;
  } catch (error) {
    console.error("somee error in llm", error);
  }
};

export default LLM;
