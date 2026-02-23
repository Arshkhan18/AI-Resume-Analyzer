import model from "../aiProvider.js";

export const analyzeResume = async(resumeText) =>{
    
  const prompt = `
You are an expert resume reviewer.

Analyze the following resume and provide:

1. Overall Score (0-100)
2. Strengths
3. Weaknesses
4. Missing Sections
5. Improvement Suggestions

Respond strictly in this JSON format:

{
  "score": number,
  "strengths": [],
  "weaknesses": [],
  "missingSections": [],
  "improvements": []
}

Resume:
${resumeText}
`;
const response = await model.invoke(prompt);

//Gemini sometimes json as markdown
const clean = response.content
  .replace(/```json|```/g, "")
  .trim();
return JSON.parse(clean);
// try {
//     return JSON.parse(clean);
//   } catch {
//     throw new Error("Invalid AI JSON response");
//   }
}