import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FC25 } from '@/app/components/Theme';

type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: String(error?.message || error) };
  }

  componentDidCatch(error: any) {
    // no-op: could log to service
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
          <Text style={[styles.title, { color: FC25.colors.text }]}>Något gick fel</Text>
          {!!this.state.message && (
            <Text style={{ color: FC25.colors.subtle, marginBottom: 12 }}>{this.state.message}</Text>
          )}
          <Pressable style={[styles.btn, { backgroundColor: FC25.colors.primary }]} onPress={this.handleReset}>
            <Text style={styles.btnText}>Försök igen</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children as any;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 20, fontWeight: '800' },
  btn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
  btnText: { color: '#0a0a0f', fontWeight: '800' },
});

export default ErrorBoundary;

