import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const OA_ACCESS_TOKEN = process.env.OA_ACCESS_TOKEN || '';

app.post('/oa/send-message', async (req, res) => {
  try {
    const { user_id, text } = req.body;
    const r = await fetch('https://openapi.zalo.me/v2.0/oa/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': OA_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        recipient: { user_id },
        message: { text },
      }),
    });
    const data = await r.json();
    res.status(r.ok ? 200 : 400).json(data);
  } catch (e) {
    res.status(500).json({ error: e?.message || 'internal_error' });
  }
});

app.post('/checkout/create-order', async (req, res) => {
  res.json({ transId: undefined, mac: undefined });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => console.log(`[server] listening on :${port}`));