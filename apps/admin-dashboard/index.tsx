// File: apps/admin-dashboard/pages/index.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function WebsitePromptEditor() {
  const [prompt, setPrompt] = useState('Create a clean website for my pediatric dental clinic with contact and appointment booking sections.');
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSite = async () => {
    setLoading(true);
    const res = await fetch('/api/generate-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setGeneratedHTML(data.html || '');
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Website Builder</h1>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-32 p-3 border rounded mb-4"
      />
      <Button onClick={generateSite} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Website'}
      </Button>

      {generatedHTML && (
        <Card className="mt-6">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <iframe
              className="w-full h-[400px] border rounded"
              srcDoc={generatedHTML}
              title="Site Preview"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// File: apps/backend-api/routes/generate-site.py
from fastapi import APIRouter, Request
from openai import OpenAI
import os

router = APIRouter()

@router.post("/generate-site")
async def generate_site(request: Request):
    body = await request.json()
    prompt = body.get("prompt")

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert web designer. Generate beautiful, accessible dental websites in clean HTML+Tailwind."},
            {"role": "user", "content": prompt},
        ],
    )
    html = response.choices[0].message.content
    return {"html": html}
