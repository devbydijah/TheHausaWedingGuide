// POST { email, amount, fileName }
// Initializes a Paystack transaction and returns { authorization_url, reference }

const PAYSTACK_SECRET =
  process.env.PAYSTACK_SECRET || process.env.VITE_PAYSTACK_SECRET_KEY;
const PUBLIC_BASE_URL = (
  process.env.PUBLIC_BASE_URL ||
  process.env.VITE_PUBLIC_BASE_URL ||
  "http://localhost:5173"
).replace(/\/$/, "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, amount, fileName } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "email required" });
  }

  // Default amount if not provided (in kobo - Nigerian currency subunit)
  const initAmount = amount || process.env.PRICE_KOBO || 100000; // 1000 Naira = 100000 kobo

  // Callback URL where Paystack will redirect after payment
  const callback_url = `${PUBLIC_BASE_URL}/success`;

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Number(initAmount),
          callback_url,
          metadata: {
            file_name: fileName || "Hausa_Wedding_Guide.pdf",
            customer_email: email,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Paystack error:", data);
      return res
        .status(400)
        .json({ error: data.message || "Payment initialization failed" });
    }

    return res.status(200).json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error("Initialize payment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
