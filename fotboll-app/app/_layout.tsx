import { Stack } from 'expo-router';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import LoadingOverlay from '@/app/components/LoadingOverlay';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="player" options={{ headerShown: false }} />
        <Stack.Screen name="trainer" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
      {showLoading && <LoadingOverlay />}
    </ErrorBoundary>
  );
}
