// backend/services/openaiClient.js

/**
 * Simple OpenAI client wrapper used by ai.service.js.
 * Reads the API key and model from environment variables.
 * Returns the raw assistant content from OpenAI's Chat Completion endpoint.
 * Supports an optional `responseFormat` argument to request JSON schema enforcement.
 */

export async function callOpenAI(messages, { model, responseFormat } = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment');
  }

  const chosenModel = model || process.env.OPENAI_MODEL || 'gpt-4o-mini'; // default safe model

  const payload = {
    model: chosenModel,
    messages,
    ...(responseFormat ? { response_format: responseFormat } : {}),
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const assistantMessage = data?.choices?.[0]?.message?.content;
  if (typeof assistantMessage !== 'string') {
    throw new Error('Unexpected OpenAI response shape');
  }

  return assistantMessage;
}
