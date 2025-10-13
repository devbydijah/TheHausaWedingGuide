// Test endpoint to simulate webhook flow and send actual emails
import {
  sendDownloadEmail,
  sendWebAppAccessEmail,
  sendBundleEmail,
} from "../lib/email.js";

export default async function handler(req, res) {
  console.log("[TEST-WEBHOOK] 🧪 Testing webhook email flow...");

  const testEmail = req.query.email || "k.kabir@devwithdijah.com";
  const productType = req.query.product || "webapp"; // 'webapp', 'pdf', or 'bundle'

  console.log("[TEST-WEBHOOK] 📧 Test email:", testEmail);
  console.log("[TEST-WEBHOOK] 📦 Product type:", productType);

  try {
    let result;

    if (productType === "webapp") {
      console.log("[TEST-WEBHOOK] 📤 Sending Web App email...");
      result = await sendWebAppAccessEmail(testEmail, "TEST-REF-123");
      console.log("[TEST-WEBHOOK] ✅ Web App email sent!");
    } else if (productType === "pdf") {
      console.log("[TEST-WEBHOOK] 📤 Sending PDF email...");
      const testDownloadLink =
        "https://the-hausa-weding-guide.vercel.app?download=test";
      result = await sendDownloadEmail(testEmail, testDownloadLink);
      console.log("[TEST-WEBHOOK] ✅ PDF email sent!");
    } else if (productType === "bundle") {
      console.log("[TEST-WEBHOOK] 📤 Sending Bundle email...");
      const testDownloadLink =
        "https://the-hausa-weding-guide.vercel.app?download=test";
      result = await sendBundleEmail(
        testEmail,
        testDownloadLink,
        "TEST-REF-123",
        false
      );
      console.log("[TEST-WEBHOOK] ✅ Bundle email sent!");
    }

    return res.status(200).json({
      success: true,
      message: `${productType} email sent to ${testEmail}`,
      result: result,
      note: "This simulates what happens in the webhook when payment succeeds",
    });
  } catch (error) {
    console.error("[TEST-WEBHOOK] ❌ Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}
