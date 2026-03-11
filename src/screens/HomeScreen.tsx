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
  const { transcript, isListening, start, stop } = useSpeechRecognition();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>expo-voice-agent</Text>
      <Text style={styles.subtitle}>Voice-first AI agent interface</Text>

      <ScrollView
        style={styles.transcriptBox}
        contentContainerStyle={styles.transcriptContent}
      >
        <Text style={styles.transcriptText}>
          {transcript || "Appuyez sur le micro pour parler…"}
        </Text>
      </ScrollView>

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
    marginBottom: 32,
  },
  transcriptContent: {
    padding: 16,
  },
  transcriptText: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
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
