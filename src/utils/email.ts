import nodemailer from "nodemailer";
import TestMail from "../../emails";
import {render} from "@react-email/render";

const transporter = nodemailer.createTransport({
    host: "smtp.abc.cz",
    port: 465,
    secure: true,
    auth: {
        user: "my_user",
        pass: "my_password",
    },
});

export const sendEmail = async (to: string, html: string) => {
    await transporter.sendMail({
        from: '"Test 👻" <test@abc.cz>',
        to,
        subject: "Test mail",
        html,
})};

const emailHtml = render(TestMail());

sendEmail("a@a.cz", emailHtml);
