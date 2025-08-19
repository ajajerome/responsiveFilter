import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { ENABLE_AUDIO, AUDIO_SUCCESS_URL, AUDIO_FAIL_URL } from '@/config/appConfig';

type Props = {
  correct: boolean;
  message?: string;
  onNext: () => void;
};

export default function AnswerResult({ correct, message, onNext }: Props) {
  useEffect(() => {
    let sound: Audio.Sound | undefined;
    (async () => {
      try {
        if (ENABLE_AUDIO) {
          await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
          sound = new Audio.Sound();
          await sound.loadAsync({ uri: correct ? AUDIO_SUCCESS_URL : AUDIO_FAIL_URL });
          await sound.playAsync();
        }
      } catch {
        try {
          if (correct) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
        } catch {}
      }
    })();
    return () => {
      sound?.unloadAsync().catch(() => {});
    };
  }, [correct]);
  return (
    <View style={[styles.container, { backgroundColor: correct ? '#e6ffed' : '#ffe6e6', borderColor: correct ? '#2ecc71' : '#ff6b6b' }]}> 
      <Text style={[styles.title, { color: correct ? '#208e4e' : '#c44545' }]}> 
        {correct ? 'Rätt svar!' : 'Fel svar'}
      </Text>
      {message ? <Text style={styles.msg}>{message}</Text> : null}
      <Pressable accessibilityRole="button" onPress={onNext} style={styles.nextBtn}>
        <Text style={styles.nextTxt}>Nästa fråga</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, borderWidth: 2, borderRadius: 12, alignItems: 'center', gap: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  msg: { textAlign: 'center', color: '#333' },
  nextBtn: { marginTop: 8, backgroundColor: '#1e90ff', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  nextTxt: { color: 'white', fontWeight: '700' },
});
