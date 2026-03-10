# expo-voice-agent

A voice-first AI agent interface built with Expo + TypeScript.

Talk to it. It listens. It thinks. It talks back.

Designed to plug into **OpenClaw** (or any OpenRouter-compatible backend) — same agent identity, topics, sub-agents — but through a fluid real-time voice interface instead of a chat UI.

---

## Vision

> "I want to talk to my AI like I talk to a human — voice in, voice out, streaming, real-time."

This app is the mobile front-end for that. It connects to OpenClaw's agent infrastructure and wraps it in a voice layer:

- 🎙️ **Continuous mic listening** with VAD (silence detection)
- 📝 **STT** — speech-to-text (Whisper or Deepgram)
- 🧠 **LLM streaming** — token-by-token from Claude/GPT via OpenRouter
- 🔊 **TTS streaming** — audio starts playing before the full response is ready
- 🗂️ **Topic/thread awareness** — same agent context as Telegram
- 🤖 **Sub-agent dispatching** — agent can spawn tasks and narrate results in voice

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Expo App (iOS/Android)             │
│                                                     │
│  [Mic] → VAD → STT → [Text] → OpenClaw API         │
│                                    ↓                │
│                           Streaming LLM Response    │
│                                    ↓                │
│                      TTS Chunks → [Speaker]         │
└─────────────────────────────────────────────────────┘
```

### Layers

| Layer | Options | Notes |
|-------|---------|-------|
| Audio capture | `expo-audio` | New stable API |
| VAD | RMS-based silence detection | Custom, lightweight |
| STT | OpenAI Whisper API | Easy, accurate |
| LLM | OpenRouter → Claude/GPT | SSE streaming |
| TTS | OpenAI TTS / ElevenLabs | Streaming audio chunks |
| Backend | OpenClaw Gateway | Agent identity + topics |

---

## Roadmap

### Phase 1 — Skeleton
- [ ] Expo app boilerplate (TypeScript, bare workflow)
- [ ] Mic permission + audio capture (`expo-audio`)
- [ ] Basic VAD: silence detection via RMS threshold
- [ ] Send audio to Whisper API → get transcript

### Phase 2 — LLM Integration
- [ ] Connect to OpenRouter (SSE streaming)
- [ ] Display streaming text in UI
- [ ] Basic conversation history (in-memory)

### Phase 3 — TTS Streaming
- [ ] OpenAI TTS or ElevenLabs streaming
- [ ] Queue audio chunks and play in real-time
- [ ] Smooth handoff: start speaking before full response received

### Phase 4 — OpenClaw Integration
- [ ] Auth / connect to OpenClaw Gateway
- [ ] Topic selection (map to OpenClaw topics)
- [ ] Sub-agent awareness: agent announces spawned tasks via voice

### Phase 5 — Polish
- [ ] Custom voice identity (ElevenLabs voice cloning)
- [ ] Wakeword detection (optional)
- [ ] Background mode
- [ ] iOS + Android tested

---

## Tech Stack

- **Expo** (bare workflow, SDK 52+)
- **TypeScript**
- **expo-audio** — mic + playback
- **OpenAI API** — Whisper STT + TTS
- **OpenRouter** — LLM streaming (Claude, GPT, etc.)
- **ElevenLabs** (optional) — premium voice
- **OpenClaw Gateway** — agent backend

---

## Why Not Just Use the ChatGPT App?

ChatGPT's voice mode is locked to OpenAI. This app:

- Connects to **your** agent with **your** identity and memory
- Supports **any model** via OpenRouter
- Gives you **topic/thread awareness** and **sub-agent dispatching**
- Is a **deployable product**, not a consumer app

---

## Getting Started

```bash
# (Coming soon — scaffold in progress)
npx create-expo-app expo-voice-agent --template blank-typescript
cd expo-voice-agent
npm install expo-audio
```

---

## Notes on Costs

| Service | Cost | Notes |
|---------|------|-------|
| OpenAI Whisper | $0.006/min | Very cheap |
| OpenAI TTS | $15/1M chars | ~$0.01 per response |
| ElevenLabs | $5-22/mo | Better quality, streaming |
| OpenRouter LLM | Varies | Claude Sonnet ~$3/$15 per 1M tokens |

For casual use, cost is negligible. For a real product, ElevenLabs + Deepgram are better options.

---

_Built for Rone. Designed to make AI conversations feel human._
