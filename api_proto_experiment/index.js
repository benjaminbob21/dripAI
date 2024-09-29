import express from 'express';
import multer from 'multer';
import axios from 'axios';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// GPT-4 Vision API endpoint
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Utility function to pause for a specified time
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Maximum number of retries
const MAX_RETRIES = 5;

// Route for handling image uploads and analysis with retry logic
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded.' });
    }

    // Read the uploaded image as a base64 string
    const imagePath = path.join(__dirname, req.file.path);
    const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

    // Prepare the request to OpenAI
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please identify the clothing items and accessories in this image, including their colors, style and relative sizes compared to the person in the picture. Give in a list in format [cloth type, color/s, simple description (10 words max), relative size (one adjective like baggy, fitted)]. Just clothes on the one main focus of the image nothing else. If nobody in the picture return nothing',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500, // Adjust as needed
    };

    // Set up headers with API key
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    // Retry logic
    let retries = 0;
    let success = false;
    let openaiResponse;

    while (retries < MAX_RETRIES && !success) {
      try {
        openaiResponse = await axios.post(OPENAI_API_URL, payload, { headers });
        success = true; // Break the loop on successful request
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // Too many requests - wait before retrying
          const retryAfter = error.response.headers['retry-after']
            ? parseInt(error.response.headers['retry-after']) * 1000
            : 5000; // Default to 5 seconds if no header
          
          console.log(`Rate limit hit. Retrying in ${retryAfter / 1000} seconds...`);
          await delay(retryAfter); // Wait before retrying
          retries++;
        } else {
          throw error; // Throw other errors
        }
      }
    }

    if (!success) {
      return res.status(429).json({ success: false, message: 'Rate limit exceeded. Please try again later.' });
    }

    // Clean up the uploaded file
    fs.unlinkSync(imagePath);

    // Send GPT-4's response back to the client
    res.json({
      success: true,
      message: openaiResponse.data.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ success: false, message: 'Error processing the image.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
