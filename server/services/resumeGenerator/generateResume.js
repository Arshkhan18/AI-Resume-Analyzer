import fs from "fs";
import path from "path";
import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const __dirname = path.resolve();
const isProduction = process.env.NODE_ENV === "production";

/* ── Utility: Escape LaTeX special characters (text only, NOT urls) ── */

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

/* ── Safe array normalizer ── */

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

/* ── Convert array to LaTeX bullet items ── */

function generateItemizeSection(items = []) {
  return safeArray(items)
    .map((item) => `\\item ${escapeLatex(item)}`)
    .join("\n");
}

/* ── Convert projects array to LaTeX items with bold titles ── */

function generateProjectsSection(projects = []) {
  return safeArray(projects)
    .map((proj) => {
      if (typeof proj === "string") return `\\item ${escapeLatex(proj)}`;

      let line = "\\item";
      if (proj.title) line += ` \\textbf{${escapeLatex(proj.title)}}`;
      if (proj.techStack) line += ` \\hfill \\textit{(${escapeLatex(proj.techStack)})}`;
      if (proj.description) line += `\n\\newline ${escapeLatex(proj.description)}`;
      return line;
    })
    .join("\n\\vspace{2mm}\n");
}

/* ── Convert education array to table rows ── */

function generateEducationRows(education = []) {
  return safeArray(education)
    .map(
      (ed) =>
        `${escapeLatex(ed.year || "")} & ${escapeLatex(ed.degree || "")} & ${escapeLatex(ed.score || "")} \\\\ \\hline`
    )
    .join("\n");
}

/* ── Build the LaTeX compile command based on environment ── */

function getLatexCommand(outputDir, texFilePath) {
  if (isProduction) {
    // Docker / TeX Live — latexmk handles multiple passes automatically
    return `latexmk -pdf -interaction=nonstopmode -output-directory="${outputDir}" "${texFilePath}"`;
  }
  // Local development — plain pdflatex
  return `pdflatex -interaction=nonstopmode -output-directory="${outputDir}" "${texFilePath}"`;
}

/* ── Compile a .tex file to PDF ── */

function compilePdf(outputDir, texFilePath, pdfPath) {
  const cmd = getLatexCommand(outputDir, texFilePath);

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (fs.existsSync(pdfPath)) return resolve(pdfPath);

      console.error("LaTeX compilation failed:");
      console.error(stderr || stdout);
      reject(new Error("PDF generation failed"));
    });
  });
}

/* ══════════════════════════════════════════════════════════
   MAIN — Generate Resume
══════════════════════════════════════════════════════════ */

export const generateResume = async (formData) => {
  formData = formData || {};

  const education = safeArray(formData.EDUCATION);
  const projects = safeArray(formData.PROJECTS);
  const experience = safeArray(formData.EXPERIENCE_SECTION);
  const positions = safeArray(formData.POSITIONS_SECTION);
  const achievements = safeArray(formData.ACHIEVEMENTS_SECTION);

  /* ── Template selection (experience → placement, else fresher) ── */
  const templateName = experience.length > 0 ? "placement" : "fresher";
  const templatePath = path.join(__dirname, "templates", `${templateName}.tex`);

  if (!fs.existsSync(templatePath)) throw new Error("Template file not found");

  let template = fs.readFileSync(templatePath, "utf8");

  /* ── Placeholder replacements ── */
  const replacements = {
    NAME: escapeLatex(formData.NAME || ""),
    PHONE: escapeLatex(formData.PHONE || ""),

    // URLs / email — do NOT escape
    EMAIL: formData.EMAIL || "",
    LINKEDIN: formData.LINKEDIN || "",
    GITHUB: formData.GITHUB || "",

    EDUCATION_ROWS: generateEducationRows(education),
    PROJECTS_SECTION: generateProjectsSection(projects),
    EXPERIENCE_SECTION: generateItemizeSection(experience),

    PROGRAMMING_SKILLS: escapeLatex(formData.PROGRAMMING_SKILLS || ""),
    WEB_SKILLS: escapeLatex(formData.WEB_SKILLS || ""),
    DATABASE_SKILLS: escapeLatex(formData.DATABASE_SKILLS || ""),
    TOOLS: escapeLatex(formData.TOOLS || ""),

    POSITIONS_SECTION: generateItemizeSection(positions),
    ACHIEVEMENTS_SECTION: generateItemizeSection(achievements),
  };

  for (const [key, value] of Object.entries(replacements)) {
    template = template.replaceAll(`{{${key}}}`, value);
  }

  /* ── Write .tex & compile ── */
  const outputDir = path.resolve("generated");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `${templateName}_${Date.now()}`;
  const texFilePath = path.join(outputDir, `${fileName}.tex`);
  const pdfPath = path.join(outputDir, `${fileName}.pdf`);

  fs.writeFileSync(texFilePath, template);

  return compilePdf(outputDir, texFilePath, pdfPath);
};