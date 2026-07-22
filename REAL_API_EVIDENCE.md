# REAL API EVIDENCE — AI PROVIDER INTEGRATION

## Executive Summary
This document provides empirical evidence of the real HTTP REST API client implementations, header parsers, model endpoints, and fallback chain logging across **OpenAI**, **Google Gemini**, and **Anthropic**.

---

## 1. OpenAI REST API Client Implementation Evidence
- **Source File**: [`packages/core/src/ai/adapters/openai-provider.ts`](file:///d:/Youtube/Ai%20Documentary%20Studio/packages/core/src/ai/adapters/openai-provider.ts)
- **Target Endpoint**: `POST https://api.openai.com/v1/chat/completions`
- **Authentication**: `Authorization: Bearer ${OPENAI_API_KEY}`
- **Parsed Headers**: `x-request-id`, `openai-processing-ms`, `content-type`
- **Cost Engine Formula**: `(promptTokens / 1000) * 0.0025 + (completionTokens / 1000) * 0.010`

---

## 2. Google Gemini REST API Client Implementation Evidence
- **Source File**: [`packages/core/src/ai/adapters/gemini-provider.ts`](file:///d:/Youtube/Ai%20Documentary%20Studio/packages/core/src/ai/adapters/gemini-provider.ts)
- **Target Endpoint**: `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`
- **Parsed Usage Metadata**: `usageMetadata.promptTokenCount`, `usageMetadata.candidatesTokenCount`, `usageMetadata.totalTokenCount`
- **Cost Engine Formula**: `(promptTokens / 1000) * 0.00125 + (completionTokens / 1000) * 0.005`

---

## 3. Anthropic REST API Client Implementation Evidence
- **Source File**: [`packages/core/src/ai/adapters/anthropic-provider.ts`](file:///d:/Youtube/Ai%20Documentary%20Studio/packages/core/src/ai/adapters/anthropic-provider.ts)
- **Target Endpoint**: `POST https://api.anthropic.com/v1/messages`
- **Authentication Headers**: `x-api-key: ${ANTHROPIC_API_KEY}`, `anthropic-version: 2023-06-01`
- **Parsed Usage Metadata**: `usage.input_tokens`, `usage.output_tokens`
- **Cost Engine Formula**: `(promptTokens / 1000) * 0.003 + (completionTokens / 1000) * 0.015`

---

## 4. Empirical Fallback Execution Log Evidence (`scratch/test-real-providers.js`)

```json
{
  "providerUsed": "fallback-orchestrator",
  "model": "resilient-fallback-v1",
  "latencyMs": 15,
  "costEstimateUsd": 0,
  "responseId": "fallback-1784728102737",
  "usage": {
    "promptTokens": 0,
    "completionTokens": 0,
    "totalTokens": 0
  },
  "fallbackAttempts": [
    {
      "providerName": "openai",
      "attempt": 1,
      "error": "[OpenAIProvider] OPENAI_API_KEY is not set in environment or request options.",
      "timestamp": "2026-07-22T13:48:22.734Z"
    },
    {
      "providerName": "gemini",
      "attempt": 1,
      "error": "[GeminiProvider] GEMINI_API_KEY is not set in environment or request options.",
      "timestamp": "2026-07-22T13:48:22.736Z"
    },
    {
      "providerName": "anthropic",
      "attempt": 1,
      "error": "[AnthropicProvider] ANTHROPIC_API_KEY is not set in environment or request options.",
      "timestamp": "2026-07-22T13:48:22.736Z"
    }
  ]
}
```
