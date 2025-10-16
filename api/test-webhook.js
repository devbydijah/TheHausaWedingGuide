// api/test-webhook.js

export default function handler(req, res) {
  const timestamp = new Date().toISOString();
  console.log(
    `[TEST-WEBHOOK] ✅✅✅ I AM ALIVE! Request received at: ${timestamp}`
  );

  // Log the request method and body to see what we're getting
  console.log(`[TEST-WEBHOOK] Method: ${req.method}`);
  console.log(`[TEST-WEBHOOK] Body:`, req.body);

  // Send a success response back to Paystack
  res.status(200).json({ status: "ok", received: true, time: timestamp });
}
