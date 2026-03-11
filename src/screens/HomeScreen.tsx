import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

export default function HomeScreen() {
  const handleSilenceDetected = useCallback((transcript: string) => {
    console.log("[LLM] Would send to LLM:", transcript);
  }, []);

  const {
    finalTranscript,
    interimTranscript,
    isListening,
    lastSubmitted,
    start,
    stop,
  } = useSpeechRecognition({
    lang: "fr-FR",
    silenceTimeoutMs: 1500,
    onSilenceDetected: handleSilenceDetected,
  });

  const hasTranscript = finalTranscript || interimTranscript;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>expo-voice-agent</Text>
      <Text style={styles.subtitle}>Voice-first AI agent interface</Text>

      <ScrollView
        style={styles.transcriptBox}
        contentContainerStyle={styles.transcriptContent}
      >
        {hasTranscript ? (
          <Text style={styles.transcriptText}>
            {finalTranscript}
            {interimTranscript ? (
              <Text style={styles.interimText}>
                {finalTranscript ? " " : ""}
                {interimTranscript}
              </Text>
            ) : null}
          </Text>
        ) : (
          <Text style={styles.placeholderText}>
            Appuyez sur le micro pour parler…
          </Text>
        )}
      </ScrollView>

      {lastSubmitted ? (
        <View style={styles.submittedBox}>
          <Text style={styles.submittedLabel}>Envoyé au LLM :</Text>
          <Text style={styles.submittedText}>{lastSubmitted}</Text>
        </View>
      ) : null}

      <Pressable
        style={[styles.micButton, isListening && styles.micButtonActive]}
        onPress={isListening ? stop : start}
      >
        <Text style={styles.micIcon}>{isListening ? "⏹" : "🎤"}</Text>
      </Pressable>

      {isListening && (
        <Text style={styles.listeningLabel}>Écoute en cours…</Text>
      )}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#888",
    fontSize: 16,
    marginBottom: 32,
  },
  transcriptBox: {
    maxHeight: 200,
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 12,
    marginBottom: 16,
  },
  transcriptContent: {
    padding: 16,
  },
  transcriptText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },
  interimText: {
    color: "#888",
    fontStyle: "italic",
  },
  placeholderText: {
    color: "#555",
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
  },
  submittedBox: {
    width: "100%",
    backgroundColor: "#0a2a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#1a4a2a",
  },
  submittedLabel: {
    color: "#4caf50",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  submittedText: {
    color: "#c8e6c9",
    fontSize: 14,
    lineHeight: 20,
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  micButtonActive: {
    backgroundColor: "#e53935",
  },
  micIcon: {
    fontSize: 32,
  },
  listeningLabel: {
    color: "#e53935",
    fontSize: 14,
  },
});
