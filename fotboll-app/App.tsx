import { Slot } from 'expo-router';
import { View, Text } from 'react-native';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { FC25 } from '@/app/components/Theme';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: FC25.colors.bg }}>
      <ErrorBoundary fallback={<View style={{ padding: 16 }}><Text style={{ color: FC25.colors.warning }}>Ett fel uppstod. Starta om appen.</Text></View>}>
        <Slot />
      </ErrorBoundary>
    </View>
  );
}
