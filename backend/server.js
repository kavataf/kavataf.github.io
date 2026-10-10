require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

app.use(express.json({ limit: "10kb" }));

// Allow your deployed portfolio and local development frontend.
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests without an Origin header, such as health checks.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin not allowed by CORS"));
    }
}));

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
    res.send("Portfolio email API is running.");
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields.
        if (![name, email, subject, message].every(
            value => typeof value === "string" && value.trim()
        )) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        // Limit input lengths.
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

        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanSubject = subject.trim();
        const cleanMessage = message.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (!process.env.RESEND_API_KEY || !process.env.RECEIVER_EMAIL) {
            console.error("Missing required email environment variables.");

            return res.status(500).json({
                success: false,
                message: "Email service is not configured."
            });
        }

        const { data, error } = await resend.emails.send({
            // Resend's testing sender; verify a domain for production.
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: [process.env.RECEIVER_EMAIL],
            replyTo: cleanEmail,
            subject: `${cleanSubject}`,
            text: [
                `Name: ${cleanName}`,
                `Email: ${cleanEmail}`,
                "Message:",
                cleanMessage
            ].join("\n")
        });

        if (error) {
            console.error("Resend email error:", error);

            return res.status(502).json({
                success: false,
                message: "Unable to send your message. Please try again later."
            });
        }

        console.log("Contact email accepted by Resend:", data?.id);

        return res.status(200).json({
            success: true,
            message: "Your message has been sent successfully!"
        });

    } catch (error) {
        console.error("Contact form error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to send your message. Please try again later."
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
