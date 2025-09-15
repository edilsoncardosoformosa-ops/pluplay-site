// server.js
import express from 'express';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';

const app = express();
app.use(cors());

const SUPABASE_URL = "https://nqhthypeljupfftlmwsz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaHRoeXBlbGp1cGZmdGxtd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODIwNzcsImV4cCI6MjA3MzI1ODA3N30.4JcgkPqt-yMrLCNdP65nQL99xyhDs2DrgR-C-CrT4z4";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.get('/questions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('questoes')
      .select('id, bloco_id, enunciado, correta, comentario');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));