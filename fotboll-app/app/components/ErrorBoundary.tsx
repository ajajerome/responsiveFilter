import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, message: String(error?.message ?? error) };
  }

  componentDidCatch(error: any) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: '#fff' }}>Ett fel uppstod i renderingen.</Text>
          {this.state.message ? <Text style={{ color: '#999' }}>{this.state.message}</Text> : null}
        </View>
      );
    }
    return this.props.children;
  }
}

