require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN
}));

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

transporter.verify()
    .then(() => {
        console.log("Gmail SMTP connection successful");
    })
    .catch((error) => {
        console.error("Gmail SMTP verification failed:", error);
    });

app.get("/", (req, res) => {
    res.send("Portfolio email API is running.");
});

app.post("/api/contact", async (req, res) => {
    console.log("Contact form request received");
    try {
        const { name, email, subject, message } = req.body;

        if (![name, email, subject, message].every(
            value => typeof value === "string" && value.trim()
        )) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        if (
            name.length > 100 ||
            email.length > 254 ||
            subject.length > 200 ||
            message.length > 5000
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more fields are too long."
            });
        }

        const cleanEmail = email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.RECEIVER_EMAIL,
            replyTo: cleanEmail,
            subject: `${subject.trim()}`,
            text: [
                `Name: ${name.trim()}`,
                `Email: ${cleanEmail}`,
                `Subject: ${subject.trim()}`,
                "",
                "Message:",
                message.trim()
            ].join("\n")
        });

        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully!"
        });
    } catch (error) {
        console.error("Email sending failed:", error);
        res.status(500).json({
            success: false,
            message: "Unable to send your message. Please try again later."
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
