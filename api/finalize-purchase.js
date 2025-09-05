import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import fetch from "node-fetch";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

const PDF_FILE_PATH = "Hausa_Wedding_Guide.pdf";
const DOWNLOAD_LINK_EXPIRATION = 24 * 60 * 60; // 24 hours in seconds

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { tx_ref } = req.body;

  if (!tx_ref) {
    return res
      .status(400)
      .json({ message: "Transaction reference is required." });
  }

  try {
    // 1. Verify transaction with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    if (!paystackResponse.ok) {
      throw new Error("Failed to verify transaction with Paystack.");
    }

    const paystackData = await paystackResponse.json();

    if (paystackData.data.status !== "success") {
      return res.status(400).json({ message: "Transaction not successful." });
    }

    const { email, amount } = paystackData.data.customer;
    const paidAmount = amount / 100; // Paystack amount is in kobo

    // 2. Check if this transaction has already been processed
    const { data: existingSale, error: selectError } = await supabase
      .from("sales")
      .select("id")
      .eq("paystack_reference", tx_ref)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116: 'No rows found'
      console.error("Error checking for existing sale:", selectError);
      throw new Error("Database error while checking for existing sale.");
    }

    if (existingSale) {
      return res
        .status(409)
        .json({ message: "This transaction has already been processed." });
    }

    // 3. Insert the sale into the database
    const { data: newSale, error: insertError } = await supabase
      .from("sales")
      .insert({
        customer_email: email,
        paystack_reference: tx_ref,
        amount_paid: paidAmount,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting sale:", insertError);
      throw new Error("Could not record the sale in the database.");
    }

    // 4. Generate a signed download URL
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("guide") // The bucket name
        .createSignedUrl(PDF_FILE_PATH, DOWNLOAD_LINK_EXPIRATION);

    if (signedUrlError) {
      console.error("Error creating signed URL:", signedUrlError);
      throw new Error("Could not create secure download link.");
    }

    const downloadUrl = signedUrlData.signedUrl;

    // 5. Send email with Resend
    try {
      await resend.emails.send({
        from: "The Hausa Wedding Guide <noreply@thehausaweddingguide.com>",
        to: [email],
        subject: "Your Hausa Wedding Guide is Here!",
        html: `
          <h1>Thank You for Your Purchase!</h1>
          <p>Hi there,</p>
          <p>Thank you for purchasing The Hausa Wedding Guide. You can download your copy using the secure link below.</p>
          <a href="${downloadUrl}" style="background-color: #28a745; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Your Guide</a>
          <p>This link is valid for 24 hours.</p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The Hausa Wedding Guide Team</p>
        `,
      });
    } catch (emailError) {
      // Log the email error but don't block the user from getting the link on the page
      console.error("Failed to send confirmation email:", emailError);
    }

    // 6. Return the download URL to the client
    return res.status(200).json({ downloadUrl });
  } catch (error) {
    console.error("Finalize-purchase error:", error);
    return res
      .status(500)
      .json({ message: error.message || "An internal server error occurred." });
  }
}
