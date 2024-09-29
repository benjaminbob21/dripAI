import axios from "axios"
import cors from "cors";
import express, { Request, Response } from "express";

import "dotenv/config";

const app = express();
import path from "path";

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/.api/test", async (req: Request, res: Response) => {
  res.json({ message: "hello from express endpoint!" });
});

app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const { dataImageUrl } = req.body;

    if (!dataImageUrl) {
      res.status(400).json({ success: false, message: 'No image provided in the request.' });
      return;
    }

    // Prepare the request payload for OpenAI API
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: process.env.PROMPT_WITHOUT_MOOD + "casual", // The text prompt with mood
            },
            {
              type: 'image_url',
              image_url: {
                url: dataImageUrl, // Use the provided base64 data URL
              },
            },
          ],
        },
      ],
      max_tokens: 1000, // Adjust the tokens if needed
    };

    // Set up headers with API key
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    // Make the API call to OpenAI
    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });

    // Send GPT-4's response back to the client
    res.json({
      success: true,
      message: openaiResponse.data.choices[0].message.content,
    });
  } catch (error) {
    if (!(error instanceof Error)) return;

    console.error('Error with OpenAI API:', error.message);
    res.status(500).json({ success: false, message: 'Error processing the image.' });
  }
});

app.listen(7000, () => {
  console.log("server running on localhost:7000");
});
