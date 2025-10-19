// Corrected api/email.js

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = "The Hausa Wedding Guide <purchase@thehausaweddingguide.com>";

export const sendDownloadEmail = async (to, downloadLink) => {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: "Your Hausa Wedding Guide is Here!",
      // Use simple HTML instead of React/JSX
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Thank You for Your Purchase!</h2>
          <p>Your Hausa Wedding Guide is ready for download.</p>
          <p>Please click the button below to get your PDF. This link will expire in 24 hours.</p>
          <a href="${downloadLink}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
            Download Your Guide
          </a>
          <p>If you have any issues, please contact our support team.</p>
          <p>Sincerely,<br/>The Hausa Wedding Guide Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("[EMAIL] Resend API error (PDF):", error);
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.error("[EMAIL] Fatal error in sendDownloadEmail:", err);
    throw err;
  }
};

export const sendWebAppAccessEmail = async (to, reference) => {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: "Welcome to the Interactive Hausa Wedding Guide!",
      // Use simple HTML instead of React/JSX
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Welcome!</h2>
          <p>Thank you for purchasing access to the interactive Hausa Wedding Guide web application.</p>
          <p>You can now log in using the email address you purchased with. Your first-time login might require a password reset or a magic link, depending on your account status.</p>
          <p>Your purchase reference is: <strong>${reference}</strong></p>
          <a href="https://the-hausa-weding-guide.vercel.app" style="background-color: #008CBA; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
            Access the Web App
          </a>
          <p>Enjoy planning your perfect wedding!</p>
          <p>Sincerely,<br/>The Hausa Wedding Guide Team</p>
        </div>
      `,
    });
    
    if (error) {
      console.error("[EMAIL] Resend API error (Web App):", error);
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.error("[EMAIL] Fatal error in sendWebAppAccessEmail:", err);
    throw err;
  }
};