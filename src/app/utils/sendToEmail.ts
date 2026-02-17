import nodemailer from 'nodemailer';
import config from '../config';

export const sendToEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.google_app_email,
      pass: config.google_app_password,
    },
  });
  await transporter.sendMail({
    from: config.google_app_email,
    to,
    subject,
    html,
  });
};
