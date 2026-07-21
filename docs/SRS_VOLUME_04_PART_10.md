# SRS Volume 04 Part 10 — Application Settings

## Overview
The Application Settings System manages every configurable aspect of the AI Documentary Studio: centralized, versioned, validated configuration for the application, workspace, projects, providers, rendering, performance, security, and user preferences.

## Settings Hierarchy
System → Application → Workspace → Channel → Project → Scene. Lower levels override higher levels.

## Categories
General, AI Providers, Image Providers, Voice Providers, Rendering, Timeline, Motion, Effects, QA, Export, Performance, Cache, Security, Plugins, Updates, Shortcuts, Appearance (17 categories).

## Sub-Modules

### Settings Hierarchy
Layered resolution: System → Application → Workspace → Channel → Project → Scene. Lowest level wins.

### Settings Categories
17 categories with registration, description, and per-category setting listing.

### General Settings
Language, region, timeFormat, autoSaveInterval, defaultWorkspace, startupBehavior, notificationPreferences.

### AI Provider Settings
Default provider, model, routing policy, temperature, maxTokens, timeout, retryCount, budgetLimits. Per-project overrides.

### Image Provider Settings
Default provider, resolution, aspectRatio, qualityProfile, seedStrategy, styleLock, retryPolicy, cachePolicy.

### Voice Provider Settings
Default voice, language, speakingRate, pitch, emotionProfile, outputFormat, offlineVoicePreference.

### Render Settings
Resolution, FPS, codec, bitrate, hardwareAcceleration, multiThreadRendering, renderPriority.

### Performance Settings
CPU/GPU/RAM limits, background rendering, concurrent jobs, cache size, preview quality.

### Cache Settings
Per-cache-type configuration for image, voice, prompt, render, thumbnail caches. One-click cleanup.

### Appearance
Dark/light/system theme, accentColor, uiScaling, fontSize.

### Keyboard Shortcuts
Customizable shortcuts per action. Import/export shortcut profiles. Reset to defaults.

### Backup & Recovery
Auto/manual backup, frequency, location, snapshot count, crash recovery.

### Security Settings
API key storage, plugin permissions, workspace encryption, audit logging, telemetry preferences.

### Settings Validation
Type check, range validation, dependency rules, provider compatibility before save.

### Settings Import/Export
JSON and encrypted package formats. Backup/restore profiles.

### Settings Search
Instant search across all settings by key, label, description, category.

### Settings Profile Manager
Reusable profiles: High Performance, Low-End PC, Maximum Quality, Fast Draft, Laptop Mode. Instant switching.

### Smart Settings Recommender
Hardware analysis → optimal settings recommendations for render, performance, cache. Advisory only.

### Configuration History
Track every change: previous/new value, timestamp, user, source. Rollback support.

### Live Configuration Preview
Preview theme changes, estimate render time, project storage usage, indicate quality changes before applying.

### Policy Locks
Lock specific settings with authorization. Locked settings visible but not modifiable without approval.

## Orchestrator
`ASApplicationSettings` composes all 23 sub-modules.
