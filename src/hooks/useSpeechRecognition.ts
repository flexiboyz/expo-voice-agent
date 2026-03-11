import { useState, useRef, useCallback } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "@jamsch/expo-speech-recognition";

const SILENCE_TIMEOUT_MS = 1500;
const DEFAULT_LANG = "fr-FR";

export interface SpeechRecognitionOptions {
  lang?: string;
  silenceTimeoutMs?: number;
  onSilenceDetected?: (finalTranscript: string) => void;
}

export function useSpeechRecognition(options?: SpeechRecognitionOptions) {
  const {
    lang = DEFAULT_LANG,
    silenceTimeoutMs = SILENCE_TIMEOUT_MS,
    onSilenceDetected,
  } = options ?? {};

  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState("");

  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalTranscriptRef = useRef("");

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const submitTranscript = useCallback(() => {
    const text = finalTranscriptRef.current.trim();
    if (!text) return;

    console.log("[STT] Silence detected — submitting transcript:", text);
    setLastSubmitted(text);
    onSilenceDetected?.(text);

    ExpoSpeechRecognitionModule.stop();
  }, [onSilenceDetected]);

  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(submitTranscript, silenceTimeoutMs);
  }, [clearSilenceTimer, submitTranscript, silenceTimeoutMs]);

  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
    setFinalTranscript("");
    setInterimTranscript("");
    finalTranscriptRef.current = "";
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
    setInterimTranscript("");
    clearSilenceTimer();
  });

  useSpeechRecognitionEvent("result", (event) => {
    const bestTranscript = event.results[0]?.transcript ?? "";

    if (event.isFinal) {
      const updated = finalTranscriptRef.current
        ? `${finalTranscriptRef.current} ${bestTranscript}`
        : bestTranscript;
      finalTranscriptRef.current = updated;
      setFinalTranscript(updated);
      setInterimTranscript("");
      resetSilenceTimer();
    } else {
      setInterimTranscript(bestTranscript);
      resetSilenceTimer();
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.warn("Speech recognition error:", event.error, event.message);
    setIsListening(false);
    clearSilenceTimer();
  });

  const start = useCallback(async () => {
    const { granted } =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      console.warn("Speech recognition permission not granted");
      return;
    }

    setLastSubmitted("");

    ExpoSpeechRecognitionModule.start({
      lang,
      continuous: true,
      requiresOnDeviceRecognition: true,
      interimResults: true,
    });
  }, [lang]);

  const stop = useCallback(() => {
    clearSilenceTimer();
    ExpoSpeechRecognitionModule.stop();
  }, [clearSilenceTimer]);

  return {
    /** Accumulated final (confirmed) transcript segments */
    finalTranscript,
    /** Current interim (in-progress) transcript */
    interimTranscript,
    /** Full display transcript: final + interim combined */
    transcript: interimTranscript
      ? finalTranscript
        ? `${finalTranscript} ${interimTranscript}`
        : interimTranscript
      : finalTranscript,
    isListening,
    /** Last transcript submitted via silence detection */
    lastSubmitted,
    start,
    stop,
  };
}
