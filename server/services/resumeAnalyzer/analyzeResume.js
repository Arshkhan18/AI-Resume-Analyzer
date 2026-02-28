import model from "../aiProvider.js";

export const analyzeResume = async(resumeText) =>{
    
  const prompt = `
You are an ATS (Applicant Tracking System) evaluator.

Analyze the following resume and provide:

1. ATS Score (0–100)
2. Strengths (bullet points)
3. Weaknesses (bullet points)
4. Missing Keywords
5. Concrete Improvement Suggestions
6. Section-wise Feedback (Education, Skills, Experience, Projects)

Return response strictly in JSON format:

{
  "score": number,
  "strengths": [],
  "weaknesses": [],
  "missing_keywords": [],
  "improvements": [],
  "section_feedback": {
    "education": "",
    "skills": "",
    "experience": "",
    "projects": ""
  }
}

Resume:
${resumeText}
`;
const response = await model.invoke(prompt);

//Gemini sometimes json as markdown
const clean = response.content
  .replace(/```json|```/g, "")
  .trim();

try {
    return JSON.parse(clean);
  } catch {
    throw new Error("Invalid AI JSON response");
  }
}