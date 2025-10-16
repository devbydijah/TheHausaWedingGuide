// Script to fetch email details from Resend using the email ID
// Usage: node resend-get-email.js <email_id>

import { Resend } from "resend";

const resend = new Resend("re_Fo7wZakF_H5RD6Rk9zXqRBVtrHd7JC358");

const emailId = process.argv[2];

if (!emailId) {
  console.error("Usage: node resend-get-email.js <email_id>");
  process.exit(1);
}

(async function () {
  try {
    const result = await resend.emails.get(emailId);
    console.log("Email details:", result);
  } catch (error) {
    console.error("Error fetching email:", error);
  }
})();
