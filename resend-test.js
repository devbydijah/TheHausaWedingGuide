// Minimal standalone test script for Resend Node.js SDK
// Usage: node resend-test.js

import { Resend } from "resend";

const resend = new Resend("re_Fo7wZakF_H5RD6Rk9zXqRBVtrHd7JC358"); // Use your actual API key

(async function () {
  const { data, error } = await resend.emails.send({
    from: "Hausa Room <contact@devwithdijah.com>", // Use your verified sender or domain
    to: ["k.kabir@devwithdijah.com"], // Test recipient on verified domain
    subject: "Hello from Resend Minimal Test",
    html: "<strong>If you see this, your Resend setup works!</strong>",
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();
