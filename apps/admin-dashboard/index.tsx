// File: apps/admin-dashboard/pages/index.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardHome() {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    const res = await fetch('/api/generate-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    console.log('Generated site:', data);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Your Dental Website</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        placeholder="Describe your practice..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
      />
      <Button onClick={handleGenerate}>Generate Website</Button>
    </main>
  );
}

// File: apps/backend-api/routes/generate-site.py
from fastapi import APIRouter, Request
import openai

router = APIRouter()

@router.post("/generate-site")
async def generate_site(request: Request):
    body = await request.json()
    prompt = body.get("prompt")

    openai.api_key = "YOUR_OPENAI_KEY"
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a web copywriter."},
            {"role": "user", "content": prompt}
        ]
    )
    content = response["choices"][0]["message"]["content"]
    return {"html": content}

// File: packages/templates/default-site-template.ts
export const renderTemplate = (data: { heading: string; body: string }) => `
  <html>
    <head><title>${data.heading}</title></head>
    <body>
      <h1>${data.heading}</h1>
      <p>${data.body}</p>
    </body>
  </html>
`;

// File: prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Dentist {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
}

model Appointment {
  id        String   @id @default(cuid())
  dentistId String
  patient   String
  time      DateTime
  Dentist   Dentist  @relation(fields: [dentistId], references: [id])
}

// File: integrations/whatsapp-webhook/index.ts
import express from 'express';
const app = express();
app.use(express.json());

app.post('/webhook/whatsapp', (req, res) => {
  const message = req.body;
  console.log('Incoming WhatsApp message:', message);
  // Handle notification logic here
  res.sendStatus(200);
});

app.listen(3001, () => console.log('Webhook listening on port 3001'));

// File: docker-compose.yml
version: '3.9'
services:
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
  backend:
    build: ./apps/backend-api
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/postgres
  whatsapp-webhook:
    build: ./integrations/whatsapp-webhook
    ports:
      - "3001:3001"
