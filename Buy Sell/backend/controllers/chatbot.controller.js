import dotenv from "dotenv";
import { Protected } from "../config/authenticate.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const makeGeminiRequest = async (messages, retryCount = 0) => {
  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents: formattedMessages }),
        signal: AbortSignal.timeout(10000),
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (
      retryCount < MAX_RETRIES &&
      (error.response?.status === 503 || error.code === "ECONNABORTED")
    ) {
      console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES})...`);
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * (retryCount + 1))
      );
      return makeGeminiRequest(messages, retryCount + 1);
    }
    throw error;
  }
};

const chatSessions = new Map();

const WEBSITE_CONTEXT = `You are a chatbot for a Buy-Sell website specifically for IIIT students. The website allows students to buy and sell products within the IIIT community. You can help with:

1. Authentication:
   - IIIT Email Login (ending with .iiit.ac.in)
   - CAS Authentication
   - Account signup for first-time users

2. User Features:
   - Profile management (firstname, lastname, email, age, phone number)
   - Product listings management
   - Order tracking
   - Shopping cart operations

3. Product Management:
   - Browsing products
   - Adding new listings
   - Updating existing items
   - Removing listings

4. Shopping Features:
   - Cart management
   - Checkout process
   - Order history
   - Review system

Only assist with website-related queries. For unrelated questions, respond with "This is not related to our website's features."`;

export const initiateChat = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success == false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }

  const userId = verify.user.email;

  try {
    if (!chatSessions.has(userId)) {
      chatSessions.set(userId, [
        {
          role: "Model",
          text: WEBSITE_CONTEXT,
        },
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "Chat session initialized",
      history: chatSessions.get(userId),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success == false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  const userId = verify.user.email;
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message content is required",
    });
  }

  try {
    const user = "User";
    const gemini = "Model";
    if (chatSessions.has(userId)) {
      chatSessions.get(userId).push({ role: user, text: message });
    } else {
      chatSessions.set(userId, [
        {
          role: "Model",
          text: WEBSITE_CONTEXT,
        },
      ]);
      chatSessions.get(userId).push({ role: user, text: message });
    }
    const response = await makeGeminiRequest(chatSessions.get(userId) || []);
    const botMessage =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm having trouble understanding that. Could you rephrase?";

    chatSessions.get(userId).push({ role: gemini, text: botMessage });
    return res.status(200).json({
      success: true,
      message: "Message processed successfully",
      botMessage: botMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};
