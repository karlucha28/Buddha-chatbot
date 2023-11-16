// Import the required modules
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

// Create a new Express app
const app = express();

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

// Define the port number
const port = process.env.PORT || 3000;

// Define the Telegram bot token
const botToken = "YOUR_BOT_TOKEN";

// Define the OpenAI API key
const openaiApiKey = "YOUR_OPENAI_API_KEY";

// Create a new instance of the OpenAI API
const openai = new OpenAIApi(
  new Configuration({
    apiKey: openaiApiKey,
  })
);

// Create a webhook for the bot using the Telegram API
axios
  .post(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    url: `https://YOUR_SERVER_URL/webhook`,
  })
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.error(err);
  });

// Create a route handler for the webhook
app.post("/webhook", async (req, res) => {
  // Get the message from the request body
  const message = req.body.message;

  // Check if the message is valid
  if (message && message.text) {
    // Get the chat id and the text from the message
    const chatId = message.chat.id;
    const text = message.text;

    // Initialize an empty array for the chat history
    let chatHistory = [];

    // Check if the text is a start command
    if (text === "/start") {
      // Send a welcome message to the user
      await sendMessage(
        chatId,
        "Hello, I am a chatbot that can answer your questions as if I were Buddha. Ask me anything you want to know about life, happiness, suffering, or enlightenment."
      );
    } else {
      // Get the previous messages from the chat history
      chatHistory = await getChatHistory(chatId);

      // Add the user's message to the chat history
      chatHistory.push({
        role: "user",
        content: text,
      });

      // Generate a response for the user using the OpenAI API
      const response = await generateResponse(chatHistory);

      // Send the response to the user
      await sendMessage(chatId, response);

      // Add the chatbot's response to the chat history
      chatHistory.push({
        role: "expert",
        content: response,
      });
    }

    // Save the chat history
    await saveChatHistory(chatId, chatHistory);
  }

  // Send a status code of 200 to acknowledge the webhook
  res.sendStatus(200);
});

// Define a function to send a message to the user using the Telegram API
const sendMessage = async (chatId, text) => {
  try {
    // Make a POST request to the Telegram API
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
  } catch (err) {
    // Log the error
    console.error(err);
  }
};

// Define a function to get the chat history from a database or a file
// For simplicity, we will use a JSON file to store the chat history
const getChatHistory = async (chatId) => {
  // Import the fs module
  const fs = require("fs");

  // Define the file name
  const fileName = `./chat_history_${chatId}.json`;

  // Check if the file exists
  if (fs.existsSync(fileName)) {
    // Read the file and parse the JSON data
    const data = JSON.parse(fs.readFileSync(fileName, "utf8"));

    // Return the chat history
    return data.chatHistory;
  } else {
    // Return an empty array
    return [];
  }
};

// Define a function to save the chat history to a database or a file
// For simplicity, we will use a JSON file to store the chat history
const saveChatHistory = async (chatId, chatHistory) => {
  // Import the fs module
  const fs = require("fs");

  // Define the file name
  const fileName = `./chat_history_${chatId}.json`;

  // Write the chat history to the file as a JSON string
  fs.writeFileSync(fileName, JSON.stringify({ chatHistory: chatHistory }));
};

// Define a function to generate a response for the user using the OpenAI API
const generateResponse = async (chatHistory) => {
  try {
    // Make a request to the OpenAI API using the createChatCompletion function
    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatHistory,
      user: "user",
      expert: "expert",
      temperature: 0.7,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      stop: ["\n"],
    });

    // Get the response from the result
    const response = res.data.choices[0].message.content;

    // Return the response
    return response;
  } catch (err) {
    // Log the error
    console.error(err);

    // Return a default response
    return "Sorry, I could not generate a response. Please try again later.";
  }
};

// Start the server and listen for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






































// import express from "express";
// import bodyParser from "body-parser";
// import axios from "axios";
// // import OPENAI_SECRET_KEY from "C:\Users\karls\OneDrive\Рабочий стол\WebDev Angela_lect\buddha-chatbot\.env"
// const app = express();
// const PORT = 3000;
// const OPENAI_SECRET_KEY="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"

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));



// app.get('/', (req, res) => {
//   res.send('Buddha Chatbot is running!');
// });


// async function getGPT3Response() {

//   const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
//   const prompt = 'Your user prompt here';


//   try {
//     const response = await axios.post(apiUrl, {
//       prompt,
//       max_tokens: 100,
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${OPENAI_SECRET_KEY}`,
//       },
//     });

//     console.log(response.data.choices[0].text.trim());
//   } catch (error) {
//     console.error('Error calling GPT-3 API:', error.message);
//   }
// }



//   app.post('/chat', async (req, res) => {
//     const userMessage = req.body.message;
  
//     // Get response from GPT-3
//     const gpt3Response = await getGPT3Response(userMessage);
  
//     const chatResponse = {
//       user: userMessage,
//       bot: gpt3Response,
//     };
  
//     res.json(chatResponse);
//   });

  

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });