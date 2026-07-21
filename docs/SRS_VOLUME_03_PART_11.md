# Export Engine — Volume 03 Part 11

## Overview
Converts approved productions into platform-optimized deliverables. Preserves visual/audio quality, metadata, and production integrity.

## Modules

| Module | File | Description |
|--------|------|-------------|
| Types | `types.ts` | Core type definitions (formats, codecs, resolutions, framerates, bitrate modes, platforms, presets, metadata, archive, manifest, delivery, versions, AI decisions, contract) |
| Export Formats | `export-formats.ts` | MP4/MOV/MKV/WebM/Image Sequence support with MIME types |
| Video Codecs | `video-codecs.ts` | H.264/H.265/AV1/ProRes/DNxHR with fallback selection |
| Audio Codecs | `audio-codecs.ts` | AAC/Opus/PCM/FLAC support |
| Platform Presets | `platform-presets.ts` | 7 built-in presets (YouTube Long/Shorts, Instagram, TikTok, Facebook, X, Archive Master) |
| Resolution Profiles | `resolution-profiles.ts` | 720p/1080p/1440p/4K/8K with dimension maps |
| Frame Rate Profiles | `frame-rate-profiles.ts` | 24/25/30/50/60 FPS validation |
| Bitrate Manager | `bitrate-manager.ts` | CBR/VBR/CQ with platform-optimized recommendations |
| Metadata Embedding | `metadata-embedding.ts` | Title, author, copyright, description, language, DNA version embedding |
| Thumbnail Export | `thumbnail-export.ts` | Main/alternative/frame-capture/safe-crop in PNG/JPG/WebP |
| Project Archive | `project-archive.ts` | Timeline + assets + audio + subtitles + motion + settings + QA report package |
| Version Manager | `version-manager.ts` | Version history (draft → final → published) with unique identifiers |
| AI Export Optimizer | `ai-export-optimizer.ts` | Analyzes production to optimize bitrate, codec, encoding speed, compression, upload size |
| Multi-Destination Export | `multi-destination-export.ts` | One-click export to multiple platforms with optimized profiles |
| Export Manifest | `export-manifest.ts` | Machine-readable manifest (production ID, codec, resolution, QA score, checksums) |
| Smart Delivery Packager | `smart-delivery-packager.ts` | Complete delivery package (video + thumbnails + subtitles + metadata + QA + certificate + archive) |
| Zenn Export Profile | `zenn-export-profile.ts` | Default MP4/H.264/1080p/30/VBR/AAC/YouTube/archive profile |
| Validator | `validator.ts` | 6-point pre-export validation (video, audio, subtitles, metadata, codec, container) |
| Output Contract | `output-contract.ts` | Format/codec/resolution/FPS/platform/status contract |
| Export Engine | `export-engine.ts` | `EEExportEngine` — top-level orchestrator composing all 20 sub-engines |
