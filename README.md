# expo-voice-agent

A voice-first AI agent interface built with Expo + TypeScript.

Talk to it. It listens. It thinks. It talks back.

Designed to plug into **OpenClaw** (or any OpenRouter-compatible backend) — same agent identity, topics, sub-agents — but through a fluid real-time voice interface instead of a chat UI.

---

## Vision

> "I want to talk to my AI like I talk to a human — voice in, voice out, streaming, real-time."

This app is the mobile front-end for that. It connects to OpenClaw's agent infrastructure and wraps it in a voice layer:

- 🎙️ **Native on-device STT** — iOS SFSpeechRecognizer (Siri) + Android SpeechRecognizer, **no audio sent to cloud**
- 📝 **Continuous transcription** — real-time streaming transcript as you speak
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

| Layer | Package | Notes |
|-------|---------|-------|
| STT (on-device) | `@jamsch/expo-speech-recognition` | iOS SFSpeechRecognizer + Android SpeechRecognizer. `requiresOnDeviceRecognition: true` = no cloud, no latency |
| LLM | OpenRouter → Claude/GPT | SSE streaming |
| TTS | OpenAI TTS / ElevenLabs | Streaming audio chunks |
| Audio playback | `expo-audio` | Chunk queue playback |
| Backend | OpenClaw Gateway | Agent identity + topics |

#### Why native on-device STT?

- **No Whisper API cost** — zero STT cost
- **No upload latency** — transcript starts instantly
- **Privacy** — audio never leaves the device
- **Continuous mode** — keeps listening, streams results as you speak
- iOS uses **Siri's engine** (SFSpeechRecognizer) — very accurate in French
- Android uses Google on-device model (needs one-time download)

---

## Roadmap

### Phase 1 — Skeleton
- [ ] Expo app boilerplate (TypeScript, bare/dev-client workflow)
- [ ] Integrate `@jamsch/expo-speech-recognition`
- [ ] Mic permission + `requiresOnDeviceRecognition: true`
- [ ] Continuous listening → streaming transcript in UI
- [ ] Silence detection: stop on pause, send to LLM

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

- **Expo** (bare/dev-client workflow, SDK 52+)
- **TypeScript**
- **`@jamsch/expo-speech-recognition`** — native on-device STT (iOS + Android)
- **`expo-audio`** — audio playback (TTS chunks)
- **OpenRouter** — LLM streaming (Claude, GPT, etc.)
- **OpenAI TTS / ElevenLabs** — voice synthesis
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
npx expo install expo-audio @jamsch/expo-speech-recognition
```

> ⚠️ Requires a **custom dev client** (not Expo Go). Run `npx expo run:ios` or `npx expo run:android`.

### On-Device STT — Quick Example

```typescript
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from '@jamsch/expo-speech-recognition';

useSpeechRecognitionEvent("result", (ev) => {
  setTranscript(ev.results[0]?.transcript ?? "");
});

ExpoSpeechRecognitionModule.start({
  lang: "fr-FR",
  continuous: true,
  requiresOnDeviceRecognition: true, // 🔒 never leaves the device
  interimResults: true,              // stream results as you speak
});
```

---

## Notes on Costs

| Service | Cost | Notes |
|---------|------|-------|
| STT (on-device) | **Free** | Native iOS/Android — no API, no upload |
| OpenAI TTS | $15/1M chars | ~$0.01 per response |
| ElevenLabs | $5-22/mo | Better quality, streaming |
| OpenRouter LLM | Varies | Claude Sonnet ~$3/$15 per 1M tokens |

STT is now free. The only real cost is LLM inference + TTS.

---

_Built for Rone. Designed to make AI conversations feel human._
