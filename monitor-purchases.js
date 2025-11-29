import dotenv from "dotenv";

// Load environment variables from .env.production
dotenv.config({ path: ".env.production" });

// Dynamically import Resend after env vars are loaded
const { Resend } = await import("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("\n📊 PURCHASE MONITORING DASHBOARD");
console.log("=".repeat(50));
console.log(`🕐 Checked at: ${new Date().toLocaleString()}\n`);

// Check recent emails sent via Resend
console.log("📧 Recent Email Deliveries:");
console.log("-".repeat(50));

try {
  // Get recent emails (Resend API)
  const { data: emails, error } = await resend.emails.list({ limit: 10 });

  if (error) {
    console.error("❌ Error fetching emails:", error);
  } else if (emails && emails.data) {
    const pdfEmails = emails.data.filter(
      (email) =>
        email.subject?.includes("Northern Wedding Guide") ||
        email.to?.some((recipient) => typeof recipient === "string")
    );

    if (pdfEmails.length === 0) {
      console.log("⚠️  No recent PDF delivery emails found");
    } else {
      pdfEmails.forEach((email, index) => {
        const recipient = Array.isArray(email.to) ? email.to[0] : email.to;
        const status = email.last_event || "sent";
        const timestamp = new Date(email.created_at).toLocaleString();

        console.log(`\n${index + 1}. Email ID: ${email.id}`);
        console.log(`   To: ${recipient}`);
        console.log(`   Status: ${status}`);
        console.log(`   Sent: ${timestamp}`);
      });
    }
  }
} catch (err) {
  console.error("❌ Error checking emails:", err.message);
}

console.log("\n" + "=".repeat(50));
console.log("\n📌 NEXT STEPS:");
console.log(
  "1. Check Vercel logs: https://vercel.com/devbydijahprojects/the-hausa-weding-guide/logs"
);
console.log(
  "2. Check Paystack dashboard: https://dashboard.paystack.com/#/transactions"
);
console.log(
  "3. Verify webhook delivery: https://dashboard.paystack.com/#/settings/developer"
);
console.log("\n✅ For each new purchase, verify:");
console.log("   - Paystack webhook was delivered (Status: 200)");
console.log("   - Vercel function executed successfully");
console.log("   - Email was sent via Resend");
console.log("   - Customer received the email\n");
