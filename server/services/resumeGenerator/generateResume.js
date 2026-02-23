import fs from "fs";
import path from "path";
import { exec } from "child_process";
const __dirname = path.resolve();
/* =========================================================
   Utility: Escape LaTeX Special Characters (TEXT ONLY)
   DO NOT use for URLs
========================================================= */
function escapeLatex(text = "") {
  if (typeof text !== "string") return "";

  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

/* =========================================================
   Safe Array Normalizer
========================================================= */
function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

/* =========================================================
   Convert Array to LaTeX Bullet Items
========================================================= */
function generateItemizeSection(items = []) {
  return safeArray(items)
    .map(item => `\\item ${escapeLatex(item)}`)
    .join("\n");
}

/* =========================================================
   Convert Education Array to Table Rows
========================================================= */
function generateEducationRows(education = []) {
  return safeArray(education)
    .map(ed =>
      `${escapeLatex(ed.year || "")} & ${escapeLatex(ed.degree || "")} & ${escapeLatex(ed.score || "")} \\\\ \\hline`
    )
    .join("\n");
}

/* =========================================================
   MAIN FUNCTION
========================================================= */
export const generateResume = async (formData) => {

  /* ---------- Normalize Input ---------- */
  formData = formData || {};
  // console.log("Received Form Data:", formData);
  const education = safeArray(formData.EDUCATION);
  const projects = safeArray(formData.PROJECTS);
  const experience = safeArray(formData.EXPERIENCE_SECTION);
  const positions = safeArray(formData.POSITIONS_SECTION);
  const achievements = safeArray(formData.ACHIEVEMENTS_SECTION);


  /* ---------- Auto Template Selection ---------- */
  const hasExperience = experience.length > 0;
  const templateName = hasExperience ? "placement" : "fresher";

  const templatePath = path.join(__dirname, "templates", `${templateName}.tex`);
  if (!fs.existsSync(templatePath)) {
    throw new Error("Template file not found");
  }

  let template = fs.readFileSync(templatePath, "utf8");

  /* ---------- Prepare Replacement Data ---------- */
  const replacements = {
    // TEXT FIELDS (escape these)
    NAME: escapeLatex(formData.NAME || ""),
    PHONE: escapeLatex(formData.PHONE || ""),

    // URL / EMAIL FIELDS (DO NOT ESCAPE)
    EMAIL: formData.EMAIL || "",
    LINKEDIN: formData.LINKEDIN || "",
    GITHUB: formData.GITHUB || "",

    EDUCATION_ROWS: generateEducationRows(education),
    PROJECTS_SECTION: generateItemizeSection(projects),
    EXPERIENCE_SECTION: generateItemizeSection(experience),

    PROGRAMMING_SKILLS: escapeLatex(formData.PROGRAMMING_SKILLS || ""),
    WEB_SKILLS: escapeLatex(formData.WEB_SKILLS || ""),
    DATABASE_SKILLS: escapeLatex(formData.DATABASE_SKILLS || ""),
    TOOLS: escapeLatex(formData.TOOLS || ""),

    POSITIONS_SECTION: generateItemizeSection(positions),
    ACHIEVEMENTS_SECTION: generateItemizeSection(achievements),
  };

  /* ---------- Replace Placeholders Safely ---------- */
  Object.keys(replacements).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, "g");
    template = template.replace(regex, replacements[key]);
  });

  // ⚠️ IMPORTANT: DO NOT remove leftover placeholders using regex
  // That was causing LaTeX corruption.

  /* ---------- Create Output Directory ---------- */
  const outputDir = path.resolve("generated");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const fileName = `${templateName}_${Date.now()}`;
  const texFilePath = path.join(outputDir, `${fileName}.tex`);

  fs.writeFileSync(texFilePath, template);

  /* ---------- Compile PDF ---------- */
 return new Promise((resolve, reject) => {

  exec(
    `latexmk -pdf -interaction=nonstopmode -output-directory="${outputDir}" "${texFilePath}"`,
    (error, stdout, stderr) => {

      const pdfPath = path.join(outputDir, `${fileName}.pdf`);

      if (fs.existsSync(pdfPath)) {
        return resolve(pdfPath);
      }

      console.error("LaTeX Compilation Failed:");
      console.error(stderr);
      reject(new Error("PDF generation failed"));
    }
  );

});

};