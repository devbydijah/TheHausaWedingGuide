// Minimal script to verify your Resend domain
// Usage: node resend-verify-domain.js

import { Resend } from "resend";

const resend = new Resend("re_Fo7wZakF_H5RD6Rk9zXqRBVtrHd7JC358"); // Use your actual API key

(async function () {
  try {
    const result = await resend.domains.verify(
      "3b3c477f-8b82-487a-9762-0f621559f0e4"
    );
    console.log("Domain verification result:", result);
  } catch (error) {
    console.error("Domain verification error:", error);
  }
})();
