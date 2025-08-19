import { Audio } from 'expo-av';

export async function playLocal(requireRef: any) {
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const sound = new Audio.Sound();
    await sound.loadAsync(requireRef);
    await sound.playAsync();
    setTimeout(() => sound.unloadAsync().catch(() => {}), 1500);
  } catch {}
}

