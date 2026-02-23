import fs from "fs";
import pdf  from 'pdf-parse-new';

export const parseResume = async (filePath) => {

  const buffer = fs.readFileSync(filePath);

  const data = await pdf(buffer);

  const cleanedText = data.text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
    // console.log("Extracted Resume Text:", cleanedText);
  return cleanedText;
};
