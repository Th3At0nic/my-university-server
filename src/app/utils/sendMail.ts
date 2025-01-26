import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'rahatdevstudio@gmail.com',
      pass: 'zxpk dwss ungg gygk',
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: `"Rahat Dev Studio" <rahatdevstudio@gmail.com>`, // sender address
    to: email, // list of receivers
    subject: 'Password Reset Request', // Subject line
    text: 'Hello world?', // plain text body
    html: `<h3>You requested a password reset.</h3> <p>Click the link below to reset your password. The link will be expired in 10 mins!</p> <br> ${html}`, // html body
  });
};
