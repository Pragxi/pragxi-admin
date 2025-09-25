"use server";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.GMAIL_FROM,
        pass: process.env.GMAIL_APP_PASSWORD
    }
})

export const sendEmailAction = async ({from, to, subject, text, html}: {
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string
}) => {
    try {
        await transporter.sendMail({
            from: from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html // html body
        })
        return {
            status: 200,
            message: "Email sent successfully",
            success: true
        }
    } catch (err) {
        console.log({err})
        return {
            status: 500,
            message: "Failed to send email. Please try again later.",
            success: false
        }
    }
}
