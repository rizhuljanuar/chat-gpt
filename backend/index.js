import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const base64Image = fs.readFileSync('./image.png', { encoding: 'base64' });

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {

  try {
    const question = req.body.question;

    const response = await anthropic.messages.create({
      model: "claude-2.1",
      max_tokens: 1000,
      temperature: 0.6,
      system: "You are a pirate",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${question}`
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: base64Image
              }
            }
          ]
        }
      ]
    });

    res.status(200).send({
      bot: response.content[0].text
    });

  } catch (error) {
    console.log(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
