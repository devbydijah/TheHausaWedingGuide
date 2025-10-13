// Simple endpoint to verify webhook URL is accessible
export default async function handler(req, res) {
  const timestamp = new Date().toISOString();
  
  console.log(`[WEBHOOK-PING] 🏓 Ping received at ${timestamp}`);
  console.log(`[WEBHOOK-PING] Method: ${req.method}`);
  console.log(`[WEBHOOK-PING] Headers:`, req.headers);
  console.log(`[WEBHOOK-PING] Body:`, req.body);
  
  return res.status(200).json({
    status: 'alive',
    message: 'Webhook endpoint is accessible',
    timestamp: timestamp,
    method: req.method,
    yourIP: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
    note: 'If Paystack sends webhooks here, they will be logged in Vercel function logs'
  });
}
