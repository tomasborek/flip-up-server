import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587 * 1,
  secure: false,
  auth: {
    user: "MS_S6IxBT@flipup.cz",
    pass: "nEEa0QeKbellp5NW",
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: "dev@flipup.cz",
    to,
    subject,
    html,
  });
};
