// Simple email service using Resend
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDownloadEmail(email, downloadLink) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@hausaroom.com",
      to: [email],
      subject: "Your Hausa Wedding Guide - Download Link 💍",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #CE805C; margin-bottom: 10px;">Thank you for your purchase! 🎉</h1>
            <p style="font-size: 18px; color: #333;">Your Hausa Wedding Guide is ready for download</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0;">
            <p style="margin-bottom: 20px; color: #666;">Click the button below to access your guide:</p>
            <a href="${downloadLink}" 
               style="display: inline-block; background: #CE805C; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Download Your Guide Now
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              • This link expires in 24 hours<br>
              • You can download the guide up to 3 times<br>
              • The link will take you to our website
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">Happy wedding planning! 💕</p>
          </div>
        </div>
      `,
      text: `Thank you for purchasing the Hausa Wedding Guide! 

Click here to download: ${downloadLink}

This link expires in 24 hours and allows up to 3 downloads.

Happy wedding planning!`,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}
