import React from "react";
import { render } from "@react-email/render";
import fs from "fs"; // Node.js File System
import path from "path"; // Node.js Path

// --- Import your React Email components from the root 'emails' folder ---
import PDFGuideEmail from "../emails/PDFGuideEmail.jsx";
import WebGuideEmail from "../emails/WebGuideEmail.jsx";

console.log("Starting email template render...");

// Define output path inside the 'api' folder
const templatesDir = path.join(process.cwd(), "api", "email-templates");

// 1. Ensure the output directory exists
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// 2. Render PDFGuideEmail with placeholders
const pdfHtml = render(
  <PDFGuideEmail name="{{userName}}" downloadUrl="{{downloadLink}}" />
);
fs.writeFileSync(path.join(templatesDir, "pdf_guide_template.html"), pdfHtml);
console.log("Rendered pdf_guide_template.html to api/email-templates/");

// 3. Render WebGuideEmail with placeholders
const webHtml = render(
  <WebGuideEmail
    name="{{userName}}"
    signupUrl="{{signupUrl}}"
    txReference="{{txReference}}"
  />
);
fs.writeFileSync(path.join(templatesDir, "web_guide_template.html"), webHtml);
console.log("Rendered web_guide_template.html to api/email-templates/");

console.log("Email template rendering complete!");
