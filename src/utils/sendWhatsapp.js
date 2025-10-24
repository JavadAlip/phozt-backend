import Twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendWhatsappMessage = async (toNumber, message) => {
  try {
    const formattedNumber = toNumber.startsWith("+") ? toNumber : `+91${toNumber}`;
    const sentMessage = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // e.g., 'whatsapp:+14155238886'
      to: `whatsapp:${formattedNumber}`,
      body: message,
    });
    return sentMessage;
  } catch (error) {
    console.error("WhatsApp send error:", error.message);
    throw error;
  }
};