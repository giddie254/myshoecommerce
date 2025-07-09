// utils/sendSms.js (ES module version)
import twilio from 'twilio';

//const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSms = (to, message) => {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to,
  });
};

