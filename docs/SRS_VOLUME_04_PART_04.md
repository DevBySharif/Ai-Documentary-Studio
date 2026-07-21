# SRS Volume 04 Part 04 — AI Provider Manager

## Overview
The AI Provider Manager is the central abstraction layer for all AI providers in the Desktop Application. It provides a unified interface for multiple LLM providers, handles routing, fallback, load balancing, rate limiting, cost tracking, caching, streaming, and health monitoring.

## Core Types
- `APProviderName`: gemini, openai, claude, openrouter, ollama, lm_studio, google_ai_studio
- `APTaskType`: script, prompt, image_analysis, qa, topic_research, transcription, tts
- `APCapability`: text_generation, vision, structured_json, function_calling, long_context, reasoning, streaming
- `APHealthStatus`: healthy, degraded, unavailable
- `APModel`: provider, modelName, contextWindow, capabilities, cost, speed, available
- `APRouteRule`: task, provider, model, fallback[]
- `APUsageRecord`: promptTokens, completionTokens, estimatedCost, provider, timestamp, cached
- `APBenchmark`: provider, model, avgLatency, jsonAccuracy, promptQuality, hallucinationRate, costEfficiency, stability
- `APAPIKey`: provider, key, label

## Sub-Modules

### Provider Abstraction
Interface for all AI providers with generate/stream/isAvailable/getCapabilities. Built-in adapters: Gemini, OpenAI, Claude, OpenRouter, Ollama, LM Studio, Google AI Studio. Provider registry with register/get/getAvailable.

### Model Registry
Register models by provider with metadata (context window, capabilities, cost, speed). Query by provider, capability; find cheapest or fastest for a capability.

### Task Router
Maps task types to preferred provider+model with fallback chain. Default routes for script→Gemini, prompt→OpenAI, image_analysis→Gemini, QA→Claude, topic_research→OpenRouter. Customizable.

### Fallback Engine
Execute primary provider, fall back through chain if failed. Retry tracking with configurable max retries per provider.

### Load Balancer
Select least-used provider from available set. Track usage counts per provider.

### Rate Limit Manager
Track requests per minute per provider. Configurable max RPM. canSend/recordRequest interface.

### Cost Tracking
Record usage with prompt/completion tokens, cost, provider, timestamp. Daily/monthly/per-project cost aggregation.

### Response Cache
TTL-based response caching. Configurable max age. get/set/has/clear/size operations.

### Streaming Support
Detect which providers support streaming. Async iterable stream generation.

### Provider Health Monitor
Track health status per provider (healthy/degraded/unavailable). Query healthy, get unhealthy list, summary.

### API Key Manager
Secure storage for API keys per provider. get/store/delete/hasKey operations.

### Model Capability Matrix
Register model→capability mappings. Test capability compatibility, find compatible models.

### Provider Settings
Per-provider configuration with default cascade (temperature, maxTokens, topP, timeout, retryCount).

### Routing Policy Engine
Custom routing policy functions. Evaluate policies against task, budget, latency target, required capabilities.

### Benchmark Database
Record provider benchmarks for latency, accuracy, quality, hallucination, cost efficiency, stability. Query best for latency or accuracy.

### Prompt Sanitization
Redact sensitive patterns from prompts. Validate structure and length. Format for specific provider.

### Offline AI Mode
Detect and register local providers. Check offline capability.

### Output Contract Builder
Build standardized output contract: provider, model, status, latency, cached. Summary string generation.

## Orchestrator
- `APAIMProviderManager`: Composes all 20 sub-modules, provides unified access to all AI provider management functionality.
