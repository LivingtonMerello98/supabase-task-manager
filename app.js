import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompt system fisso
const systemPrompt = "Sei un assistente task. Alla prima risposta saluta e chiama l'utente Livingstone. Rispondi in modo chiaro e sintetico.";

app.get('/', (req, res) => {
  res.send('Backend Express è attivo');
});

app.post('/api/chatbot/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Messaggio mancante' });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 100,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella comunicazione con OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
